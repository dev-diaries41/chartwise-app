import {NewJob} from "qme";
import { logger} from "@src/logger";
import { hash } from "@src/utils/cryptography";
import { AuthErrors, JobErrors, ServerErrors } from "@src/constants/errors";
import { QueueController } from "@src/types";
import { backgroundJobsQueue } from "@src/index";
import { ServiceJobSchema } from "@src/constants/schemas";


export async function addJob({ req, res, queueManager }: QueueController) {
  try {
    const validationResult = ServiceJobSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({message: validationResult.error});
    }

    const { opts, data } = validationResult.data;
    const userId = req.jwtPayload?.email;
    const apiKey = req.headers['api-key'];
    if (!apiKey) throw new Error(AuthErrors.MISSING_API_KEY);

    const initiatedBy = hash(apiKey as string);
    const newJob: NewJob = { name: queueManager.queue.name, data: { ...data, initiatedBy, userId }, opts};
    const jobReceipt = await queueManager.addToQueue(newJob);
    return res.status(200).json({data: jobReceipt});
  } catch (error:any) {
    logger.error({message: 'Error adding job', details: error.message});
    if(error.message === JobErrors.JOB_NOT_ADDED){
      return res.status(400).json({message: JobErrors.JOB_NOT_ADDED})
    }
    return res.status(500).json({message: ServerErrors.INTERNAL_SERVER });
  }
}

export async function addRecurringJob({ req, res, queueManager }: QueueController) {
  try {
    const validationResult = ServiceJobSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json(validationResult);
    }

    const { pattern, jobData } = req.body;
    const apiKey = req.headers['api-key'];
    if (!apiKey) throw new Error(AuthErrors.MISSING_API_KEY);

    const initiatedBy = hash(apiKey as string);
    await queueManager.addRecurringJob(queueManager.queue.name, { ...jobData, initiatedBy }, pattern);
    return res.status(200).json({message: 'Recurring job added'});
  } catch (error: any) {
    logger.error({message: 'Error adding recurring job', details: error.message});
    res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}

export async function getJobResults({ req, res, queueManager }: QueueController) {
  try {
    const { jobId } = req.params;
    const jobResult = await queueManager.getResults(jobId, backgroundJobsQueue);
    return res.status(200).json({data: jobResult});
  } catch (error: any) {
    logger.error({message: 'Error getting job results', details: error.message});
    if(error.message === JobErrors.JOB_NOT_FOUND){
      res.status(404).json({ message: JobErrors.JOB_NOT_FOUND });
    }
    res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}

export async function cancelJob({ req, res, queueManager }: QueueController) {
  try {
    const { jobId } = req.params;
    await queueManager.cancelJob(jobId);
    return res.status(200).json({message: 'Job cancelled successfully'});
  } catch (error: any) {
    logger.error({message: 'Error cancelling job', details: error.message});
    if(error.message === JobErrors.JOB_NOT_FOUND){
      res.status(404).json({ message: JobErrors.JOB_NOT_FOUND });
    }
    res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}