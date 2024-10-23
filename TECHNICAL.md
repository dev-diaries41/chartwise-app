# The Technology Behind ChartWise

## Overview

ChartWise is designed to help traders analyse charts and create effective trade plans. This article provides a detailed look into the tools and architecture that power ChartWise. TypeScript is used throughout the codebase, both on the frontend and backend. It’s my preferred language for app development due to its strong type safety, superior developer experience, and compatibility across different environments such as frontend, backend, and mobile applications.

## Frontend Development

ChartWise’s frontend is built using **Next.js** and **TypeScript**. The analysis of charts can take up to 15 seconds on average and longer in some cases. To handle this, ChartWise employs a sophisticated polling mechanism. This mechanism checks the status of jobs periodically, providing timely updates to users about the completion or failure of an analysis. Here's an overview of how it works:

### Polling Mechanism

The polling system is implemented using a custom `Polling` class and a React hook, `usePolling`, to manage the process efficiently. 

- **Polling Class**: The `Polling` class handles the core functionality. It periodically executes a callback function to check job status. Configurable options such as polling interval, maximum duration, and maximum allowed errors ensure flexibility and reliability. If the maximum duration or error count is reached, it triggers appropriate actions and stops further polling.

```typescript

export class Polling {
  private intervalId: NodeJS.Timeout | null = null;
  private callback: () => void;
  private options: PollOptions;
  private startTime: number;
  private errorCounter: Counter;

  constructor(callback: () => void, options: Partial<PollOptions>) {
    this.callback = callback;
    this.options = {...DefaultPollOptions, ...options};
    this.startTime = 0;
    this.errorCounter = new Counter(this.options.maxErrors);
  }

  start(): void {
    if (!this.intervalId) {
      this.startTime = Date.now();
      this.intervalId = setInterval(() => {
        try {
          this.callback();
        } catch (error: any) {
          this.errorCounter.increment();
          if (this.errorCounter.isMax()) {
            if(this.options.onMaxErrors){
              this.options.onMaxErrors();
            }
            this.stop();
          }
        }
        if (Date.now() - this.startTime >= this.options.maxDuration) {
          if(this.options.onMaxDuration){
            this.options.onMaxDuration();
          }
          this.stop();
        }
      }, this.options.interval);
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
```

- **React Hook**: The `usePolling` hook simplifies integrating the polling mechanism into React components. It manages the lifecycle of the `Polling` instance, starting, stopping, and restarting the polling as needed. This hook ensures that the polling process is seamlessly integrated into the React component lifecycle, enhancing code readability and maintainability.

```typescript
const usePolling = (callback: () => void, pollingOptions: PollOptions) => {
  const [polling, setPolling] = useState<Polling | null>(null);

  useEffect(() => {
    if (!polling) {
      setPolling(new Polling(callback, pollingOptions));
    }
    return () => {
      if (polling) {
        polling.stop();
      }
    };
  }, [callback, pollingOptions]);

  const startPolling = () => {
    if (polling) {
      polling.start();
    }
  };

  const stopPolling = () => {
    if (polling) {
      polling.stop();
    }
  };

  return { startPolling, stopPolling };
};

export default usePolling;

```

### Handling Job Status

When a job is initiated, its ID is stored locally, and the polling mechanism starts after a brief delay. The `pollJobStatus` function checks the job's status at regular intervals. Depending on the job's status, appropriate actions are taken:

- **Completion**: If the job is completed, the polling stops, and the analysis results are processed and displayed to the user.
- **Failure**: If the job fails, the polling stops, an error message is displayed, and appropriate error handling routines are triggered.
- **In Progress**: If the job is still in progress, the polling continues until the job completes or fails, or the maximum polling duration is reached.

## Backend Architecture

On the backend, **TypeScript** and **Express.js** are utilized. TypeScript’s static type checking aids in reducing bugs and improving maintainability, while Express.js handles API development and data management efficiently. 

**MongoDB** is used for data storage due to my familiarity with it and the extensive boilerplate code available from previous projects.

## Queue Management

A significant part of ChartWise's backend is its robust queue management system, built using **BullMQ** and **Redis**. This system is crucial for handling the various asynchronous tasks that ensure smooth and efficient processing and analysis of charts.

### WorkerManager Class

The `WorkerManager` class is a wrapper around the BullMQ Worker class and is designed to manage workers that process jobs from the queue. It ensures that tasks are executed reliably and efficiently. Here’s how it works:

- **Worker Initialization**: The `WorkerManager` class initializes a worker using the `BullMQ` library. It is configured with default options such as concurrency and rate limiting to control the number of jobs processed simultaneously.

```typescript

export class WorkerManager {
    public worker: Worker;
    private task: ServiceJob;

    static DefaultWorkerOpts =  {
        concurrency: 1,
        limiter: { max: 10, duration: 1000 }
    }

    constructor(serviceName: string, task: ServiceJob, redis: Redis, workerOptions?: Partial<WorkerOptions>) {
        this.task = task;
        this.worker = this.createWorker(serviceName, redis, workerOptions);
    }

    private createWorker(serviceName: string, redis: Redis, workerOptions?: Partial<WorkerOptions>) {
        const opts = { ...WorkerManager.DefaultWorkerOpts, ...workerOptions }; 
        const worker = new Worker(serviceName, async (job) => await this.task(job), {connection: redis, ...opts});
        return worker;
    }

    public startWorker(handlers: WorkerEventHandlers = defaultHandlers) {
        this.worker.on('completed', handlers.onComplete);
        this.worker.on('failed', handlers.onFail);
        this.worker.on('active', handlers.onActive);
        if (handlers.onProgress){
            this.worker.on('progress', handlers.onProgress);
        }
        if (handlers.onDrained) {
          this.worker.on('drained', handlers.onDrained);
        }
    }
      
    public async stopWorker() {
        await this.worker.close();
    }
}
```

- **Task Execution**: Workers execute tasks defined by the `ServiceJob`. This modular approach allows for easy updates and maintenance of task logic.
- **Event Handling**: The `WorkerManager` sets up various event handlers to log job states and handle actions upon job completion, failure, activation, progress, and when the worker is drained of jobs. These handlers ensure that the system remains responsive and issues are logged and addressed promptly.

### QueueManager Class

The `QueueManager` class is a wrapper around the BullMQ Queue class and is responsible for managing the job queues, adding new jobs, and handling recurring jobs. Here’s an overview of its functionality:

- **Job Addition**: The `QueueManager` can add new jobs to the queue with specific options like delay and retry attempts. This flexibility ensures that jobs are scheduled appropriately based on their requirements.

```typescript

export class QueueManager {
    public queue: Queue;
    private jobOptions: JobsOptions;

    static DefaultJobOpts = {
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
      const { serviceName, jobData, when } = newJob || {};
      const delay = this.getDelay(when);
      const jobOptions = { delay,...this.jobOptions };
      return await this.queue.add(serviceName, jobData, jobOptions);
    }
    
    private async getJobReceipt(job: Job): Promise<jobReceipt> {
      const status = await job.getState();
      return { jobId: job.id, delay: job.opts.delay!, status, queue: await this.queue.count(), when: job.timestamp, jobName: job.name };
    }

    public async add(newJob: NewJob): Promise<jobReceipt> {
        try {
            const job = await this.addJob(newJob);
            const jobReceipt = await this.getJobReceipt(job)
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
        const jobs = await this.queue.getJobs(['wait', 'active', 'completed', 'failed', 'delayed']);
        for (const job of jobs) {
            if (job.name === name) {
                return job;
            }
        }
        return null;
    }

    public async getResults(jobId: string, backgroundQueue?: QueueManager): Promise<JobResult>{
        const job = await this.queue.getJob(jobId);
        if(!job) throw new Error(JobErrors.JOB_NOT_FOUND);

        const status = await job.getState();
        if(status === 'completed'){
            await this.removeCompletedJob(jobId);
            if(backgroundQueue){
                await QueueManager.cancelPendingBackgroundJob(job, backgroundQueue)
            }
        }
           
        return { data: this.filterJobReturnValue(job.returnvalue), status};
    }

    private filterJobReturnValue(returnValue: object & Partial<ServiceJobDetails>): object & Partial<ServiceJobDetails> {
      const filteredData = { ...returnValue };
      delete filteredData.initiatedBy;
      delete filteredData.userId;
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

    private getDelay(when: number) {
        const delay = when - Date.now();
        return delay > 0 ? delay : 0;
    }

    public async getJobCompletionTime(jobId: string): Promise<number | null> {
        const job = await this.queue.getJob(jobId);
        if (job) {
          if (job.finishedOn) {
            const startTime = job.timestamp;
            const finishTime = job.finishedOn;
            const completionTime = finishTime - startTime; // Time in milliseconds
            return completionTime;
          } else {
            console.log('Job has not finished yet');
            return null;
          }
        } else {
          console.log('Job not found');
          return null;
        }
      }

    public getBackgroundJobName(job: Job): string{
      return `${BackgroundJobs.REMOVE_EXPIRED_JOBS}-${job.id}-${job.queueName}`
    }

    public static async removeExpiredJob(job: Job, backgroundJobQM: QueueManager, ttl: number = Time.min){
      const newJob: NewJob = {serviceName: backgroundJobQM.getBackgroundJobName(job), when: Date.now() + ttl, jobData: {jobId: job.id}};
      await backgroundJobQM.add(newJob);
    }
    
    public static async cancelPendingBackgroundJob(job: Job, backgroundJobQM: QueueManager): Promise<void>{
      const backgroundJob = await backgroundJobQM.findJobByName(backgroundJobQM.getBackgroundJobName(job));
      if(backgroundJob && backgroundJob.id){
          await backgroundJobQM.cancelJob(backgroundJob.id);
      }
    }
}
```

- **Job Management**: It provides methods to manage jobs, such as removing completed jobs, finding jobs by name, and retrieving job results. This ensures that the system remains clean and efficient by removing unnecessary data.
- **Recurring Jobs**: The class handles the addition of recurring jobs, ensuring that critical tasks are performed at regular intervals without manual intervention.
- **Background Job Handling**: `QueueManager` includes functionality to manage background jobs, such as managing logs, removing expired jobs and cancelling pending jobs. I plan to eventually use this process to integrate a new feature that allows ChartWise users to schedule an analysis of a given trading pair e.g SPX/USD (S&P 500) or BTC/USDT (Bitcoin), at regular periods (hourly, daily, weekly, monthly) and receive results via email, telegram or discord.

### Integration with Event Handlers

The queue management system integrates with custom event handlers for comprehensive job lifecycle management. These handlers log important job events and perform additional actions like sending webhooks upon job completion, updating user usage statistics, and removing expired jobs.

**Integration and Real-Time Updates**

ChartWise integrates **OpenAI’s GPT-4o** capabilities to handle the analysis of charts. GPT-4o Vision allows ChartWise to interpret and analyse charts with a high level of accuracy, providing insightful recommendations based on chart images.

**Conclusion**

Interested in how these components come together in code? Let me know if you'd like me to open-source any parts of the referenced code.