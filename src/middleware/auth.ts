import { NextFunction, Request, Response } from "express";
import ipRangeCheck from 'ip-range-check';
import { Auth } from "@src/mongo/models/auth";
import { hash } from "@src/utils/cryptography";
import { Time } from "@src/constants/server";
import { QueueManager } from "@src/bullmq/queues";
import { AuthErrors, JobErrors, ServerErrors } from "@src/constants/errors";

// Ensures that incoming requests have valid and recent timestamps to prevent replay attacks.
function checkTimestamp(req: Request): boolean {
  const timestamp = req.headers['timestamp'];

  if (!timestamp) {
    return false; 
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp as string);

  if (isNaN(requestTime) || Math.abs(currentTime - requestTime) > 5 * Time.min) {
    return false; // Request timestamp is too old or too far in the future
  }

  return true; 
}

// Checks if the client's IP address is within the specified IP range(s).
function checkIp(req: Request, ipRange: string | string[]): boolean {
  // Retrieve the client's IP address from the request object
  const clientIP = req.ip;

  if (!clientIP || !ipRangeCheck(clientIP as string, ipRange)) {
    return false; // Client IP is not within the specified range(s)
  }

  return true; 
}



export async function verifyJobAccess(req: Request, res: Response, next: NextFunction, queueManager : QueueManager) {
  const { jobId } = req.params;
  const apiKey = req.headers['api-key'];

  if (!jobId) {
      return res.status(400).json({ message: JobErrors.INVALID_JOB_ID });
  }
  try {
      const job = await queueManager.queue.getJob(jobId);

      if (!job) {
          return res.status(404).json({ message: JobErrors.JOB_NOT_FOUND });
      }
      const hashedApiKey = hash(apiKey as string);
      if (job.returnvalue && job.returnvalue.initiatedBy !== hashedApiKey) {
          return res.status(401).json({ message: AuthErrors.UNAUTHORIZED });
      }
      next();
  } catch (error: any) {
      console.error('Error in authJobRetrieval:', error.message);
      return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['api-key'];

  if(!apiKey){
    return res.status(401).json({ message: AuthErrors.MISSING_API_KEY });
  }

  const hashedApiKey = hash(apiKey as string);
  const document = await Auth.findOne({hashedApiKey});

  if (document?.hashedApiKey) {
    next();
  } else {
    res.status(401).json({ message: AuthErrors.UNAUTHORIZED });
  }
}