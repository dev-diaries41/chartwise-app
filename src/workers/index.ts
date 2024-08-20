import { Redis } from "ioredis";
import { Job } from "bullmq";
import { chartAnalysisQueue } from "@src/index";
import { config } from "@src/config";
import { WorkerManager } from "@src/bullmq/worker";
import { runBackgroundJob } from "@src/services/background";
import { analyseCharts } from "@src/services/analysis";
import { IAnalyseCharts, ServiceJobDetails } from "@src/types";
import { chartAnalysisHandlers } from "@src/bullmq/events";
import { BackgroundJobs } from "@src/constants/services";
import { Time } from "@src/constants/server";



export async function stopWorkers(workers: WorkerManager[] = []) {
  await Promise.all(workers.map((worker) => worker.stopWorker()));
}

export function startWorkers(workerManagers: WorkerManager[]) {
  workerManagers.forEach((workerManager) => {
    if(workerManager.worker.name === config.queues?.chartAnalysis){
      workerManager.startWorker(chartAnalysisHandlers)
      return;
    }
    workerManager.startWorker()
  });
}

export function initialiseWorkers(redis: Redis) {
  const backgroundWorker = new WorkerManager(
    config?.queues?.backgroundJobs!,
    async (job: Job) => await runBackgroundJob(job),
    redis
  )

  const chartAnalysisWorker = new WorkerManager(
    config?.queues?.chartAnalysis!, 
    async(job: Job)=> {
     if(job.name.startsWith(BackgroundJobs.REMOVE_EXPIRED_JOBS) && job.id){
      return await chartAnalysisQueue.removeCompletedJob(job.id);
     }   
      return await analyseCharts(job.data as IAnalyseCharts & ServiceJobDetails)
    }, 
    redis,
    {
      concurrency: 4,
      limiter: { max: 18, duration: Time.min }  // respecting token limits for tier one openai gpt4o usage (analysis using ~ 1648 tokens). Max 18jobs per min
  });

  return { backgroundWorker, chartAnalysisWorker };
}