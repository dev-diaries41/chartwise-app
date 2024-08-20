import { NextFunction, Request, Response } from 'express';
import { RedisOptions } from 'ioredis';
import { QueueManager } from '@src/bullmq/queues';
import { roles } from '@src/constants/server';

export type Route  = {
  path: string;
  routeHandlers: RouteHandler[]
}

type RouteHandler = ((req: Request, res: Response, next: NextFunction) => void)

export interface LoggerConfig {
  logFilePaths: string[];
  rentionTime: number;
  maxSizeinMB: number;
  cron: string;
};

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface MiddlewareConfig {
  jsonLimit: string;
  rateLimit: RateLimitConfig;
  allowedOrigins: string[];
};

export interface NotifyConfig {
  telegramConfig: {
    token: string;
    options: { polling?: boolean };
    telegramChatId?: string;
  };
  discordConfig?: {
    webhookUrl?: string;
  };
}


export interface ServerConfig {
  port: number;
  databaseUrl: string;
  logger: LoggerConfig;
  middleware: MiddlewareConfig;
  routes: Route[];
  queues?: Record<string,string>;
  trustProxy?: number | string;
  redis?: RedisOptions;
  notifications?: NotifyConfig;
}


export interface ContainerStats {
  containerId: string;
  name: string;
  cpuPercent: number;
  memUsage: string;
  memLimit: string;
  memPercent: number;
  netIO: string;
  blockIO: string;
  pids: number;
}

export type Webhook = {
  url: string;
  payload: any;
}

export interface ServiceJobDetails {
  userId?: string
  initiatedBy: string;
  webhookUrl?: string;
}

export type NotificationRecipient = {
  telegramChatId?: string;
  discordWebhookUrl?: string;
};

export interface CacheOptions {
  ttl?: number; //in seconds
}
export interface QueueController {
  req: Request;
  res: Response;
  queueManager: QueueManager; 
}

export interface ServiceUsageParams {
  userId: string;
  totalUsageCount: number;
  todayFreeUsageCount: number;
  lastUsed: Date | null;
  service: string; 
}

export type Roles = keyof typeof roles


export interface TokenPayload {
  userId: string;
  username: string;
  // Add more claims as needed
}

export interface JwtOptions {
  expiresIn: string;
  secret: string;
}
