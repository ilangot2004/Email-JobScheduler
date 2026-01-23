import Redis from 'ioredis';
import { env } from './env';

// Redis connection for general use (rate limiting, etc.)
export const redis = new Redis(env.redis.url, {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
});

// BullMQ connection options (avoid ioredis type mismatches)
export const bullConnection = {
  url: env.redis.url,
} as const;

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
  console.error('💡 Make sure Redis is running on', env.redis.url);
});