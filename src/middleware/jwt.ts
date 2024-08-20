import express, { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { logger } from '@src/logger';
import { JwtService } from '@src/utils/requests/jwt';
import { AuthErrors } from '@src/constants/errors';

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