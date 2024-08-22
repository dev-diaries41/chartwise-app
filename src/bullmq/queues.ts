import { Redis } from "ioredis";
import { Job, JobsOptions, Queue } from "bullmq";
import { jobLogger } from "@src/logger";
import { JobResult, NewJob, ServiceJobDetails, jobReceipt } from '@src/types'
import { onQueueError } from "@src/bullmq/events";
import { JobErrors } from "@src/constants/errors";
import { BackgroundJobs } from "@src/constants/services";
import { Time } from "@src/constants/server";


export class QueueManager {
  public queue: Queue;
  private readonly jobOptions: JobsOptions;

  static readonly DefaultJobOpts = {
      attempts: 1,
      removeOnFail: { age: 3600 },
      removeOnComplete: true,
  }

  constructor(serviceName: string, redis: Redis, jobOptions?: JobsOptions) {
      this.jobOptions = { ...QueueManager.DefaultJobOpts, ...jobOptions };
      this.queue = new Queue(serviceName, { connection: redis });
      this.queue.on('error', (error) => onQueueError(error, serviceName)); 
  }

  private async addJob(newJob: NewJob): Promise<Job> {
    const { serviceName, jobData, when } = newJob;
    const delay = this.getDelay(when);
    const jobOptions = { delay,...this.jobOptions };
    return await this.queue.add(serviceName, jobData, jobOptions);
  }
  
  private async getJobReceipt(job: Job): Promise<jobReceipt> {
    const status = await job.getState();
    return { jobId: job.id, delay: job.opts.delay!, status, queue: await this.queue.count(), when: job.timestamp, jobName: job.name };
  }

  public async addToQueue(newJob: NewJob): Promise<jobReceipt> {
      try {
          const job = await this.addJob(newJob);
          const jobReceipt = await this.getJobReceipt(job);
          jobLogger.info({jobReceipt});
          return jobReceipt;
      } catch (error: any) {
          jobLogger.error({message: JobErrors.JOB_NOT_ADDED, details: error.message});
          throw new Error(JobErrors.JOB_NOT_ADDED);
      }
  }

  public async removeCompletedJob(jobId: string): Promise<void> {
      const job = await this.queue.getJob(jobId);
      if (job && job.finishedOn !== undefined) {
        await job.remove();
        return;
      } 
  }

  // Must use a unique job name
  public async addRecurringJob(name: string, jobData: Record<string, any> = {}, pattern = '0 0 * * * *'): Promise<void> {
      const existingBackgroundJob = await this.findJobByName(name);
      if(!existingBackgroundJob){    
          await this.queue.add(name, jobData, {repeat: {pattern}});
          jobLogger.info({message: `Added recurring job`, name});
      } else {
          jobLogger.info({message: `Recurring job already exists.`, name});
      }
  }

  public async findJobByName(name: string): Promise<Job<any> | null> {
    // Check 'delayed', 'wait', and 'active' jobs first since primary use case for cancelling jobs
    const pendingJobs = await this.queue.getJobs(['delayed', 'wait', 'active']);
    const job = pendingJobs?.find(job => job.name === name);
    if (job) return job;

    const finishedJobs = await this.queue.getJobs(['completed', 'failed']);
    return finishedJobs?.find(job => job.name === name) || null;
}

  public async getResults(jobId: string, backgroundQueue?: QueueManager): Promise<JobResult>{
      const job = await this.queue.getJob(jobId);
      if(!job) throw new Error(JobErrors.JOB_NOT_FOUND);
      const status = await job.getState();
      if(status === 'completed'){
        await this.handleCompletedJob(jobId, job, backgroundQueue);
      }  
      return { data: this.filterJobReturnValue(job.returnvalue), status};
  }

  private async handleCompletedJob(jobId: string, job: Job, backgroundQueue?: QueueManager): Promise<void> {
    await this.removeCompletedJob(jobId);
    if (backgroundQueue) {
        await QueueManager.cancelPendingBackgroundJob(job, backgroundQueue);
    }
}

  private filterJobReturnValue(returnValue: object & Partial<ServiceJobDetails>): Partial<ServiceJobDetails> {
    const { initiatedBy, userId, ...filteredData } = returnValue;
    return filteredData;
  }
  
  public async cancelJob(jobId: string): Promise<void> {
    try {
      const job = await this.queue.getJob(jobId);
      if (!job) throw new Error(JobErrors.JOB_NOT_FOUND);
      await job.remove();
      jobLogger.info({ message: `Cancelled job`, jobId, jobName: job.name});
    } catch (error: any) {
      jobLogger.error({ message: `Error cancelling job`, jobId, details: error.message });
    }
  }

  public async cancelJobByName(name: string): Promise<void> {
    try {
      const job = await this.findJobByName(name);
      if (!job) throw new Error(JobErrors.JOB_NOT_FOUND);
      await job.remove();
      jobLogger.info({ message: `Cancelled job`, jobName: name});
    } catch (error: any) {
      jobLogger.error({ message: `Error cancelling job`, jobName: name, details: error.message });
    }
  }


  private getDelay(when: number) {
      const delay = when - Date.now();
      return delay > 0 ? delay : 0;
  }

  public async getJobCompletionTime(jobId: string): Promise<number | null> {
    const job = await this.queue.getJob(jobId);
    return (!job || !job.finishedOn)? null: job.finishedOn - job.timestamp; 
  }


  public getBackgroundJobName(job: Job): string{
    return `${BackgroundJobs.REMOVE_EXPIRED_JOBS}-${job.id}-${job.queueName}`
  }

  public static async removeExpiredJob(job: Job, backgroundJobQM: QueueManager, ttl: number = Time.min){
    const newJob: NewJob = {serviceName: backgroundJobQM.getBackgroundJobName(job), when: Date.now() + ttl, jobData: {jobId: job.id}};
    await backgroundJobQM.addToQueue(newJob);
  }
  
  public static async cancelPendingBackgroundJob(job: Job, backgroundJobQM: QueueManager): Promise<void>{
    const backgroundJob = await backgroundJobQM.findJobByName(backgroundJobQM.getBackgroundJobName(job));
    if(backgroundJob && backgroundJob.id){
        await backgroundJobQM.cancelJob(backgroundJob.id);
    }
  }
}