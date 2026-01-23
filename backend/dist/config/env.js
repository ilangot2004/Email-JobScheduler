"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    database: {
        url: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/email_scheduler',
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    email: {
        etherealUser: process.env.ETHEREAL_USER || '',
        etherealPass: process.env.ETHEREAL_PASS || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production',
    },
    worker: {
        concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
    },
    server: {
        port: parseInt(process.env.PORT || '3001'),
    },
};
//# sourceMappingURL=env.js.map