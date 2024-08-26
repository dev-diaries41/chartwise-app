import { NextFunction, Request, Response } from "express";
import { Auth } from "@src/mongo/models/auth";
import { hash } from "@src/utils/cryptography";
import { QueueManager } from "@src/bullmq/queues";
import { AuthErrors, JobErrors, ServerErrors } from "@src/constants/errors";
import { JwtPayload } from 'jsonwebtoken';
import { logger } from '@src/logger';
import { JwtService } from '@src/utils/requests/jwt';



declare global {
    namespace Express {
      interface Request {
        jwtPayload?: JwtPayload & {userId: string};
      }
    }
  }

export const jwtService = new JwtService({
  expiresIn: '1h',
  secret: 'your_jwt_secret',
});

// Middleware to check JWT token
export function checkToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: AuthErrors.INVALID_TOKEN });
  }

  try {
    const jwtPayload = jwtService.verifyToken(token);
    ['iat', 'exp'].forEach(keyToRemove => {
      delete jwtPayload[keyToRemove];
    })
    req.jwtPayload = jwtPayload as JwtPayload & {userId: string}
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

  const newToken = jwtService.issueToken(req.jwtPayload);
  res.setHeader('Authorization', `Bearer ${newToken}`);
  next();
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

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
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