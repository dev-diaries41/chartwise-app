import { Redis } from "ioredis";
import { Job } from "bullmq";
import { chartAnalysisQueue } from "@src/index";
import { config } from "@src/config";
import { WorkerManager, ServiceJobData } from "qme";
import { handleBackgroundJob } from "@src/services/background";
import { analyseCharts } from "@src/services/analysis";
import { IAnalyseCharts } from "@src/types";
import { chartAnalysisHandlers, defaultHandlers } from "@src/bullmq/events";
import { BackgroundJobs, CHART_ANALYSIS_TG } from "@src/constants/services";
import { Time } from "@src/constants/server";



export async function stopWorkers(workers: WorkerManager[] = []): Promise<void> {
  await Promise.all(workers.map((worker) => worker.stopWorker()));
}

export function startWorkers(workerManagers: WorkerManager[]): void {
  workerManagers.forEach((workerManager) => {
    if(workerManager.worker.name === config.queues?.chartAnalysis){
     return  workerManager.startWorker(chartAnalysisHandlers);
    }
    return workerManager.startWorker(defaultHandlers);
  });
}

export function initialiseWorkers(redis: Redis): {
  backgroundWorker: WorkerManager;
  chartAnalysisWorker: WorkerManager;
} {
  const backgroundWorker = new WorkerManager(config?.queues?.backgroundJobs!, handleBackgroundJob, redis);

  const chartAnalysisWorker = new WorkerManager(
    config?.queues?.chartAnalysis!, 
    async(job: Job)=> {
     if(job.name.startsWith(BackgroundJobs.REMOVE_EXPIRED_JOBS) && job.id){
      return await chartAnalysisQueue.removeCompletedJob(job.id);
     }
    //  if(job.name.startsWith(CHART_ANALYSIS_TG) && job.id){
    //   return await analyseChartTelegram(job.data);
    //  }     
      return await analyseCharts(job.data as IAnalyseCharts & ServiceJobData)
    }, 
    redis,
    {
      concurrency: 4,
      limiter: { max: 18, duration: Time.min }  // respecting token limits for tier one openai gpt4o usage (analysis using ~ 1648 tokens). Max 18jobs per min
  });

  return { backgroundWorker, chartAnalysisWorker };
}