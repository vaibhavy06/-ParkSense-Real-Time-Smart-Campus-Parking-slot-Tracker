import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: Redis | null = null;
let isRedisConnected = false;

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

try {
  console.log(`Connecting to Redis at ${redisUrl}...`);
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2000, // Fail fast so the backend keeps running
    retryStrategy(times) {
      if (times > 3) {
        // Stop retrying to connect, fall back permanently
        console.warn('Redis connection failed permanently. Running in direct DB fallback mode.');
        isRedisConnected = false;
        return null; // stop retrying
      }
      return Math.min(times * 100, 2000);
    }
  });

  redisClient.on('connect', () => {
    isRedisConnected = true;
    console.log('Redis connected successfully!');
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
    console.warn(`Redis connection error: ${err.message}. Direct DB queries will be used.`);
  });
} catch (e: any) {
  console.warn(`Could not initialize Redis client: ${e.message}. Using Database Fallback.`);
  redisClient = null;
  isRedisConnected = false;
}

export const getCache = async (key: string): Promise<string | null> => {
  if (!isRedisConnected || !redisClient) return null;
  try {
    return await redisClient.get(key);
  } catch (err) {
    console.error(`Redis GET error for key ${key}:`, err);
    return null;
  }
};

export const setCache = async (key: string, value: string, ttlSeconds: number): Promise<void> => {
  if (!isRedisConnected || !redisClient) return;
  try {
    await redisClient.setex(key, ttlSeconds, value);
  } catch (err) {
    console.error(`Redis SETEX error for key ${key}:`, err);
  }
};

export const invalidateCache = async (key: string): Promise<void> => {
  if (!isRedisConnected || !redisClient) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`Redis DEL error for key ${key}:`, err);
  }
};

export { redisClient, isRedisConnected };
