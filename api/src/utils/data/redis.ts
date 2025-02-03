import Redis, { RedisOptions } from 'ioredis';
import { CacheOptions } from '@src/types';

export class RedisCache {
  private redis: Redis;
  private defaultTTL: number;
  private keyPrefix: string;

  constructor(redisOptions: RedisOptions, defaultTTL: number = 3600, keyPrefix: string = 'cache:') {
    this.redis = new Redis(redisOptions);
    this.defaultTTL = defaultTTL;
    this.keyPrefix = keyPrefix;
  }

  private getPrefixedKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  // Method to set a cache entry
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    try {
      const ttl = options?.ttl || this.defaultTTL;
      const stringValue = JSON.stringify(value);
      await this.redis.set(this.getPrefixedKey(key), stringValue, 'EX', ttl);
    } catch (error) {
      console.error(`Error setting cache for key "${key}":`, error);
      throw new Error(`Failed to set cache for key "${key}"`);
    }
  }

  // Method to get a cache entry
  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.redis.get(this.getPrefixedKey(key));
      if (result) {
        return JSON.parse(result) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting cache for key "${key}":`, error);
      throw new Error(`Failed to get cache for key "${key}"`);
    }
  }

  // Method to delete a cache entry
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(this.getPrefixedKey(key));
    } catch (error) {
      console.error(`Error deleting cache for key "${key}":`, error);
      throw new Error(`Failed to delete cache for key "${key}"`);
    }
  }

  // Method to check if a key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(this.getPrefixedKey(key));
      return result === 1;
    } catch (error) {
      console.error(`Error checking existence of key "${key}":`, error);
      throw new Error(`Failed to check existence of key "${key}"`);
    }
  }

  // Method to clear all cache entries (use with caution)
  async flushAll(): Promise<void> {
    try {
      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Error flushing all cache entries:', error);
      throw new Error('Failed to flush all cache entries');
    }
  }

  // Method to get the remaining TTL of a key
  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(this.getPrefixedKey(key));
    } catch (error) {
      console.error(`Error getting TTL for key "${key}":`, error);
      throw new Error(`Failed to get TTL for key "${key}"`);
    }
  }
}


export async function checkRedisConfig (redis: Redis): Promise<void> {
    try {
      const maxmemory = await redis.config('GET', 'maxmemory');
      const maxmemoryPolicy = await redis.config('GET', 'maxmemory-policy');
  
      console.log('maxmemory:', maxmemory);
      console.log('maxmemory-policy:', maxmemoryPolicy);
  
    } catch (error) {
      console.error('Error checking Redis config:', error);
    }
  };
  