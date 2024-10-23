import Redis from 'ioredis';

let redis: Redis | null = null;

export default function redisConnect() {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      password: process.env.REDIS_PASSWORD!,
      db: 2,
      maxRetriesPerRequest: 5,
      retryStrategy: (times) => {
        if (times >= 5) {
          return null; // No more retries
        }
        return Math.min(times * 100, 200000); // Cap delay at 200 seconds
      },
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    redis.on('connect', () => {
      console.log('Connected to Redis successfully');
    });

    redis.on('reconnecting', () => {
      console.log('Reconnecting to Redis...');
    });

    redis.on('end', () => {
      console.log('Redis connection closed');
    });
  }
  return redis;
}