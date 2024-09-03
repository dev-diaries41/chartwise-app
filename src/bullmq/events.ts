import { Job } from "bullmq";
import { jobLogger, logger } from "@src/logger";
import { sendWebhook } from "@src/utils/requests/webhooks";
import { QueueManager, WorkerEventHandlers} from "qme";
import { addUsage } from "@src/services/usage";
import { backgroundJobsQueue, chartAnalysisQueue } from "@src/index";
import { Time } from "@src/constants/server";
import { AuthErrors } from "@src/constants/errors";
import { logChartAnalysisMetrics, logQueueMetrics } from "@src/services/logs";

async function onComplete(job: Job){
    if(job.returnvalue?.webhookUrl){
        const success = await sendWebhook({url: job.returnvalue.webhookUrl, payload: {...job.returnvalue, jobId: job.id}})
    }
    jobLogger.info({message: 'Complete job', jobName: job.name, jobId: job.id});
}

export async function onCompleteRemoveJobTTL(job: Job, backgroundJobQM: QueueManager, ttl: number = 30 * 1000 * 60){
    try {
        await onComplete(job);
        await QueueManager.removeExpiredJob(job, backgroundJobQM, ttl)
    } catch (error: any) {
        jobLogger.error({message: "Error in onCompleteRemoveJobTTL", details: error.message})
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

async function updateUsage(job: Job){
    try {
        const {userId} = job.returnvalue || {};
        if(!userId) throw new Error(AuthErrors.INVALID_USER_ID)
        const result = await addUsage(userId, job.queueName);
        if(!result.success){
            logger.error({error: result.message, userId})
        }
    } catch (error: any) {
        jobLogger.error({message: "Error in updateUsage", details: error.message})
    }
}

async function removeCompletedJobTTL(job: Job, backgroundJobQM: QueueManager, ttl: number = Time.min * 30){
    try {
        await QueueManager.removeExpiredJob(job, backgroundJobQM, ttl)
    } catch (error: any) {
        jobLogger.error({message: "Error in removeCompletedJobTTL", details: error.message})
    }
}


async function onChartAnalysisComplete(job: Job){
    await onComplete(job);
    await updateUsage(job);
    await removeCompletedJobTTL(job, backgroundJobsQueue);
    if(job.id){
        await logChartAnalysisMetrics(job.id, chartAnalysisQueue);
        await logQueueMetrics(job.id, chartAnalysisQueue);
    }
}

export const chartAnalysisHandlers: WorkerEventHandlers = {
    ...defaultHandlers, onComplete: async (job) => await onChartAnalysisComplete(job)
}