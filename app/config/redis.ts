import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || 'yourpasswordhere',
  db: 2,
  maxRetriesPerRequest: 5,
  retryStrategy: (times) => {
    if (times >= 5) {
      return null;  // No more retries
    }
    // Retry after a delay that increases exponentially (100ms, 200ms, 400ms, ...)
    return Math.min(times * 100, 200000);  // Cap the delay at 200 seconds
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

export default redis;
