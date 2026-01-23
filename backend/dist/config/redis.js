"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullConnection = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
// Redis connection for general use (rate limiting, etc.)
exports.redis = new ioredis_1.default(env_1.env.redis.url, {
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy: (times) => {
        // Don't retry if Redis isn't available locally
        if (times > 3) {
            return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
    },
});
// BullMQ connection options (avoid ioredis type mismatches)
exports.bullConnection = {
    url: env_1.env.redis.url,
};
exports.redis.on('connect', () => {
    console.log('✅ Connected to Redis');
});
exports.redis.on('error', (err) => {
    // Suppress connection refused errors in local development
    // Redis is only needed for the email worker, not the API
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        // Silent - expected when Redis isn't running locally
        return;
    }
    console.error('❌ Redis connection error:', err.message);
});
//# sourceMappingURL=redis.js.map