import { ServiceJob, WorkerEventHandlers } from '../types'
import { Redis } from "ioredis";
import { Worker, WorkerOptions } from "bullmq";
import { defaultHandlers } from "./events";

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