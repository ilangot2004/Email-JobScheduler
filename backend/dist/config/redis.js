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
});
// BullMQ connection options (avoid ioredis type mismatches)
exports.bullConnection = {
    url: env_1.env.redis.url,
};
exports.redis.on('connect', () => {
    console.log('✅ Connected to Redis');
});
exports.redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
    console.error('💡 Make sure Redis is running on', env_1.env.redis.url);
});
//# sourceMappingURL=redis.js.map