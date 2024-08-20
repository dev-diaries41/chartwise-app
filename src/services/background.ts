import { Job } from "bullmq";
import { BackgroundJobs } from "@src/constants/services";
import { manageLogs } from "@src/utils/logs";
import { config } from "@src/config";
import { chartAnalysisQueue } from "@src/index";
import { jobLogger } from "@src/logger";
import { JobErrors } from "@src/constants/errors";

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