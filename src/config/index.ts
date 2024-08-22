import dotenv from 'dotenv'
import { ServerConfig } from '@src/types/server';
import { auth } from '@src/middleware';
import { chartAnalysisRoute, usageRoute, jwtRoute, sharedAnalysisRoute, journalRoute } from '@src/routes';
import { Time } from '@src/constants/server';
import { checkToken, issueNewToken } from '@src/middleware/jwt';

dotenv.config();


export const config: ServerConfig = {
  port: parseInt(process.env.PORT ?? '10000'),
  databaseUrl: process.env.MONGODB_URL!,
  logger: {
    logFilePaths: ['logs/error.log', 'logs/combined.log', 'logs/job.log', 'logs/metrics.log'],
    rentionTime: 7,
    maxSizeinMB: 100,
    cron: '0 0 * * *',
  },
  middleware: {
    jsonLimit: '50mb',
    rateLimit:{
      windowMs: 15 * Time.min,
      max: 50,
    },
    allowedOrigins: []
  },
  routes: [
    {path: '/api/v1/analysis', routeHandlers: [auth, checkToken, issueNewToken, chartAnalysisRoute]},
    {path: '/api/v1/journal', routeHandlers: [auth, checkToken, issueNewToken, journalRoute]},
    {path: '/api/v1/shared-analysis', routeHandlers: [auth, sharedAnalysisRoute]},
    {path: '/usage/credits', routeHandlers: [auth, usageRoute]},
    {path: '/auth/token', routeHandlers: [auth, jwtRoute]},
  ],
  queues:{
    backgroundJobs: 'background-jobs',
    chartAnalysis: 'chart-analysis',
  },
  redis: {
    host: process.env.REDIS_HOST!,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT!),
    db: 0, // Use database 1 for cache
    maxRetriesPerRequest: null,
    retryStrategy: function(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }    
  },
  trustProxy: process.env.TRUST_PROXY,
  notifications: {
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN!,
      options: { polling: false },
      telegramChatId: process.env.TELEGRAM_CHANNEL_ID
    },
    discordConfig:{
      webhookUrl: process.env.DISCORD_WEBHOOK_URL
    }
  },
};