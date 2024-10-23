import { RateLimiterRedis } from 'rate-limiter-flexible';
import connectRedis from './redis';

const limiter = (userId: string) => {
  const redis = connectRedis(); // Lazily get the Redis instance

  return new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: `rate_limit:${userId}`,  // Key prefix to store user limits
    points: 5,                         // Number of points (requests)
    duration: 60,                      // Per minute
    blockDuration: 60,                 // Block for 60 seconds if rate limit is exceeded
  });
};

export default limiter;
