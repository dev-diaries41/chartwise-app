import dotenv from 'dotenv'
import { ServerConfig } from '@src/types/server';
import { apiKeyAuth } from '@src/middleware';
import { chartAnalysisRoute, usageRoute, authRoute, sharedAnalysisRoute, journalRoute } from '@src/routes';
import { Time } from '@src/constants/server';
import { checkToken, issueNewToken } from '@src/middleware';

dotenv.config();


export const config: ServerConfig = {
  port: parseInt(process.env.PORT ?? '10000'),
  databaseUrl: process.env.TEST_MONGODB_URL!,
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
    {path: '/api/v1/analysis', routeHandlers: [apiKeyAuth, checkToken, chartAnalysisRoute]},
    {path: '/api/v1/journal', routeHandlers: [apiKeyAuth, checkToken, journalRoute]},
    {path: '/api/v1/usage', routeHandlers: [apiKeyAuth, usageRoute]},
    {path: '/api/v1/share', routeHandlers: [apiKeyAuth, sharedAnalysisRoute]},
    {path: '/api/v1/auth', routeHandlers: [apiKeyAuth, authRoute]},
  ],
  queues:{
    backgroundJobs: 'background-jobs',
    chartAnalysis: 'chart-analysis',
  },
  redis: {
    host: process.env.REDIS_HOST!,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT!),
    db: 0,
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