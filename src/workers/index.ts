import { WorkerManager } from "../bullmq/worker";
import { config } from "../config";
import { Redis } from "ioredis";
import { runBackgroundJob } from "../services/background";
import { Job } from "bullmq";
import { analyseCharts } from "../services/analysis";
import { IAnalyseCharts, ServiceJobDetails } from "../types";
import { chartAnalysisHandlers } from "../bullmq/events";
import { BackgroundJobs } from "../constants/services";
import { chartAnalysisQueue } from "..";
import { Time } from "../constants/server";



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