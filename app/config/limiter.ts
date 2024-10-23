import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from './redis';

const limiter = (userId: string) => {
  return new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: `rate_limit:${userId}`,  // Key prefix to store user limits
    points: 5,                         // Number of points (requests)
    duration: 60,                      // Per minute
    blockDuration: 60,                 // Block for 60 seconds if rate limit is exceeded
  });
};

export default limiter;
