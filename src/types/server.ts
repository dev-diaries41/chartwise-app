import { NextFunction, Request, Response } from 'express';
import { RedisOptions } from 'ioredis';
import { QueueManager } from 'qme';
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

export type Webhook = {
  url: string;
  payload: any;
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

export interface JwtOptions {
  expiresIn: string;
  secret: string;
}


export interface BaseResponse  {
  success: boolean;
  message?: string;
}

export interface DataResponse<T> extends BaseResponse {
  data?: T;
}

export interface PaginatedResponse extends BaseResponse {   
  totalDocuments?: number;
  page?: number;
  perPage?: number
}

export interface GetDocsResponse<T> extends PaginatedResponse {
  data?: T[];
}

export interface GetDocResponse<T> extends DataResponse<T> {}


export interface FindOneAndUpdateResponse<T> extends BaseResponse {
  updatedDoc?: T;
}

export interface AddDocResponse extends BaseResponse {
  id?: string; 
}

export interface AddMultipleDocsResponse extends BaseResponse {
  insertedCount?: number; 
}

export interface DeleteDocResponse extends BaseResponse {}

export interface DeleteDocsResponse extends BaseResponse {}

