import { Job } from "bullmq";
import { jobLogger, logger } from "@src/logger";
import { sendWebhook } from "@src/utils/requests/webhooks";
import { WorkerEventHandlers } from "@src/types";
import { QueueManager } from "@src/bullmq/queues";
import { addUsage } from "@src/services/usage";
import { backgroundJobsQueue, chartAnalysisQueue } from "@src/index";
import { Time } from "@src/constants/server";
import { AuthErrors } from "@src/constants/errors";
import { logChartAnalysisMetrics } from "@src/services/logs";

// On job complete optionally send result to webhook url if provided
export async function onComplete(job: Job){
    if(job.returnvalue?.webhookUrl){
        const success = await sendWebhook({url: job.returnvalue.webhookUrl, payload: {...job.returnvalue, jobId: job.id}})
    }
    jobLogger.info({message: 'Complete job', jobName: job.name, jobId: job.id});
}

export async function onCompleteRemoveJobTTL(job: Job, backgroundJobQM: QueueManager, ttl: number = Time.min){
    try {
        await onComplete(job);
        await QueueManager.removeExpiredJob(job, backgroundJobQM, ttl)
    } catch (error: any) {
        jobLogger.error({message: "Error in onCompleteRemoveJobTTL", details: error.message})
    }
}

export async function onCompleteUpdateUsage(job: Job){
    try {
        const {userId} = job.returnvalue || {};
        if(!userId) throw new Error(AuthErrors.INVALID_USER_ID)
        const result = await addUsage(userId, job.queueName);
        if(!result.success){
            logger.error({error: result.message, userId})
        }
    } catch (error: any) {
        jobLogger.error({message: "Error in onCompleteUpdateUsage", details: error.message})
    }
}

export async function onFail (job: Job | undefined, err: Error){
    jobLogger.error({message: "Job failed", jobId: job?.id, name: job?.name});
}

export async function onActive(job: Job){
    jobLogger.info({message: "Job active", jobId: job?.id, name: job?.name});
}

export async function onProgress(job: Job, timestamp: number | object){
    jobLogger.info({message: "Job in progress", jobId: job?.id, name: job?.name});
}

export async function onDrained(){
    jobLogger.info({message: `Worker has completed all jobs, no jobs left.`});
}

export function onQueueError(error: Error, queueName: string){
    jobLogger.error({message: 'Queue error', queue: queueName});
}

export const defaultHandlers: WorkerEventHandlers = {
    onComplete,
    onFail,
    onActive,
    onProgress,
    onDrained,
}

async function onChartAnalysisComplete(job: Job){
    await onCompleteUpdateUsage(job);
    await onCompleteRemoveJobTTL(job, backgroundJobsQueue);
    if(job.id){
        await logChartAnalysisMetrics(job.id, chartAnalysisQueue);
    }
}

export const chartAnalysisHandlers: WorkerEventHandlers = {
    ...defaultHandlers, onComplete: async (job) => await onChartAnalysisComplete(job)
}