import { NextFunction, Request, Response } from "express";
import { Auth } from "@src/mongo/models/auth";
import { hash } from "@src/utils/cryptography";
import { QueueManager } from "qme";
import { AuthErrors, JobErrors, ServerErrors } from "@src/constants/errors";
import { logger } from '@src/logger';
import { auth } from '@src/services/auth';
import { chartAnalysisQueue } from "@src/index";



// Middleware to check JWT token
export async function checkToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: AuthErrors.INVALID_TOKEN });
  }

  try {
    const jwtPayload = await auth.verifyToken(token);
    ['iat', 'exp'].forEach(keyToRemove => {
      delete jwtPayload[keyToRemove];
    })
    req.jwtPayload = jwtPayload
    next();
  } catch (error: any) {
    logger.error(error.message)
    if(error.message === AuthErrors.EXPIRED_TOKEN){
      return res.status(401).json({ message: AuthErrors.EXPIRED_TOKEN });
    }
    return res.status(401).json({ message: AuthErrors.INVALID_TOKEN });
  }
}

// Middleware to issue a new token
export function issueNewToken(req: Request, res: Response, next: NextFunction) {
  if (!req.jwtPayload) {
    return res.status(401).json({ message: 'User information is missing' });
  }

  const newToken = auth.issueToken(req.jwtPayload);
  res.setHeader('Authorization', `Bearer ${newToken}`);
  next();
}



async function verifyJobAccess(req: Request, res: Response, next: NextFunction, queueManager : QueueManager) {
  const { jobId } = req.params;
  const apiKey = req.headers['api-key'];
  const userId = req.jwtPayload?.email;

  if (!jobId) return res.status(400).json({ message: JobErrors.INVALID_JOB_ID });
  if (!userId) return res.status(401).json({ message: AuthErrors.INVALID_USER_ID });
  try {
      const job = await queueManager.queue.getJob(jobId);
      if (!job) return res.status(404).json({ message: JobErrors.JOB_NOT_FOUND });

      const hashedApiKey = hash(apiKey as string);
      if (job.returnvalue && (job.returnvalue?.initiatedBy !== hashedApiKey || job.returnvalue?.userId !== userId)) {
          return res.status(401).json({ message: AuthErrors.UNAUTHORIZED });
      }
      next();
  } catch (error: any) {
      console.error('Error in authJobRetrieval:', error.message);
      return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}

export async function authAnalysisResults(req: Request, res: Response, next: NextFunction){ 
  await verifyJobAccess(req, res, next, chartAnalysisQueue);
}

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['api-key'];

  if(!apiKey)return res.status(401).json({ message: AuthErrors.MISSING_API_KEY });
  const hashedApiKey = hash(apiKey as string);
  const document = await Auth.findOne({hashedApiKey});

  if (document?.hashedApiKey) {
    next();
  } else {
    res.status(401).json({ message: AuthErrors.UNAUTHORIZED });
  }
}