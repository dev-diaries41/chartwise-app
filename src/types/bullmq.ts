import { Job, JobState } from "bullmq";

export type MonitorWorkForceParams = {
    queueSize: number; 
    maxQueueSize: number; 
    maxWorkers: number;
    currentWorkers: number
}

export type ServiceJob = ((jobData: any) => any | void) | ((jobData: any) => Promise<any>);

export interface ServiceJobData extends Record<string,any> {
  userId?: string;
  initiatedBy?: string;
  webhookUrl?: string;}


export interface NewJob { 
    name: string;
    data: ServiceJobData
    opts?: {delay: number};
  }

export interface JobResult { 
    status: JobState | unknown |null; 
    data: Job["returnvalue"]; 
}

export interface WorkerEventHandlers { 
  onComplete: (job: Job) => void;
  onFail: (job: Job | undefined, err: Error) => void;
  onActive: (job: Job) => void;
  onProgress?: (job: Job, timestamp: number | object) => void;
  onDrained?: () => void;
}

export interface jobReceipt {
  jobId: string | undefined;
  status: JobState | "unknown";
  queue: number;
  when: number;
  delay: number
  jobName?: string;
 }


  
  