import 'module-alias/register';
import dotenv from 'dotenv';
import express from 'express';
import { Redis } from 'ioredis';
import connectDB from '@src/mongo/connect';
import { jobLogger, logger } from '@src/logger';
import { stopWorkers, startWorkers, initialiseWorkers } from '@src/workers';
import { middleware } from '@src/middleware';
import { config } from '@src/config';
import { addRoutes } from '@src/routes';
import { QueueManager } from 'qme';
import { BackgroundJobs, TelegramWebhook } from '@src/constants/services';
import { ServerErrors } from '@src/constants/errors';
import { RedisCache } from '@src/utils/data/redis';
import { Time } from '@src/constants/server';


dotenv.config();

const app = express();
const redis = new Redis(config?.redis!);
const cache = new RedisCache({...config.redis, db: 1}, (5*Time.min / 1000), 'cache');
const chartAnalysisQueue = new QueueManager(config?.queues?.chartAnalysis!, redis, jobLogger, {removeOnComplete: 1000});
const backgroundJobsQueue = new QueueManager(config?.queues?.backgroundJobs!, redis, jobLogger, {attempts: 2});
const { ...workers } = initialiseWorkers(redis);

app.use(middleware.helmet());
app.use(middleware.jsonLimit(config.middleware.jsonLimit));
// app.use(middleware.rateLimit(config.middleware.rateLimit));
app.use(middleware.cors());

if (config.trustProxy !== undefined) {
  app.set('trust proxy', config.trustProxy);
}

addRoutes(app, config.routes);

async function startServer() {
  try {
    if (!config.databaseUrl) throw new Error(ServerErrors.INVALID_DB_URL);

    await connectDB(config.databaseUrl);
    startWorkers(Object.values(workers));
    await backgroundJobsQueue.addRecurringJob(BackgroundJobs.MANAGE_LOGS, config.logger, config.logger.cron);
    app.listen(config.port, () => {console.log(`Server started on port ${config.port}`)});
  } catch (error) {
    logger.error('Error starting server: ', error);
    process.exit(1);
  }
}

async function handleShutdown(signal: string) {
  console.log(`Received ${signal}, closing server...`);
  stopWorkers(Object.values(workers));
  await redis.quit();
  process.exit(0);
}

startServer();

// process.on('SIGINT', async() => await handleShutdown('SIGINT'));
process.on('SIGTERM', async () => await handleShutdown('SIGTERM'));

export { cache, backgroundJobsQueue, chartAnalysisQueue };
