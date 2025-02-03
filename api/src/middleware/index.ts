import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { config } from '@src/config';
import { RateLimitConfig } from '@src/types';
export * from './auth'

export const middleware = {
    helmet: helmet,
    jsonLimit: (limit: string) => (express.json({ limit })),
    cors: () => cors({
      origin: (origin, callback) => {
        if (!origin || config.middleware.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    }),
    // rateLimit: (rateLimitOpts: RateLimitConfig) => rateLimit(rateLimitOpts),
  };

