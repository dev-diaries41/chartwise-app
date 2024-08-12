import { Job } from "bullmq";
import { BackgroundJobs } from "../constants/services";
import { manageLogs } from "../utils/logs";
import { config } from "../config";
import { chartAnalysisQueue } from "..";
import { jobLogger } from "../logger";
import { JobErrors } from "../constants/errors";


export async function runBackgroundJob(job: Partial<Job>): Promise<void> {
    if (!job.name) {
        throw new Error(JobErrors.MISSING_JOB_NAME);
    }
    const queueToRemoveFrom = job.name?.split('-').pop();
    switch (true) {
        case job.name.startsWith(BackgroundJobs.MANAGE_LOGS):
            return await manageLogs(job.data);
        case job.name.startsWith(BackgroundJobs.REMOVE_EXPIRED_JOBS) && queueToRemoveFrom && config.queues?.chartAnalysis.includes(queueToRemoveFrom):
            return await chartAnalysisQueue.removeCompletedJob(job.data?.jobId);
        default:
            jobLogger.warn('Unknown background job: ', job.name);
    }
}