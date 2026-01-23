import Redis from 'ioredis';
import { env } from './env';

// Redis connection for general use (rate limiting, etc.)
export const redis = new Redis(env.redis.url, {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`🔄 Redis retry attempt ${times}, waiting ${delay}ms...`);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      console.log('⚠️ Redis is in readonly mode, reconnecting...');
      return true;
    }
    return false;
  },
});

// BullMQ connection options - use Redis URL directly
// BullMQ will parse the connection string automatically
export const bullConnection = {
  url: env.redis.url,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
} as const;

// Try to connect Redis immediately (not lazy) for better error detection
redis.connect().catch((err) => {
  console.error('❌ Failed to connect to Redis:', err.message);
  console.error('💡 Redis URL:', env.redis.url.replace(/:[^:@]+@/, ':****@')); // Hide password
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('ready', () => {
  console.log('✅ Redis is ready to accept commands');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
  console.error('💡 Make sure Redis is running on', env.redis.url.replace(/:[^:@]+@/, ':****@'));
});

redis.on('close', () => {
  console.warn('⚠️ Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});