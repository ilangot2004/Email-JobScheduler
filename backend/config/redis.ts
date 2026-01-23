import Redis from 'ioredis';
import { env } from './env';

// Redis connection for general use (rate limiting, etc.)
export const redis = new Redis(env.redis.url, {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
});

// Redis connection specifically for BullMQ (separate instance)
export const bullRedis = new Redis(env.redis.url, {
  maxRetriesPerRequest: null, // BullMQ requires this to be null
  enableReadyCheck: false,
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
  console.error('💡 Make sure Redis is running on', env.redis.url);
});

bullRedis.on('connect', () => {
  console.log('✅ BullMQ Redis connection established');
});

bullRedis.on('error', (err) => {
  console.error('❌ BullMQ Redis connection error:', err);
});