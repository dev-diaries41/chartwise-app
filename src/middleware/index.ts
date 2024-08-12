import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { config } from '../config';
import { RateLimitConfig } from '../types';
export * from './auth'

export const middleware = {
    helmet: helmet,
    jsonLimit: (limit: string) => (express.json({ limit })),
    rateLimit: (rateLimitOpts: RateLimitConfig) => rateLimit(rateLimitOpts),
    cors: () => cors({
      origin: (origin, callback) => {
        if (!origin || config.middleware.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    }),
  };

