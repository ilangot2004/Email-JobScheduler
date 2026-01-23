"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const email_1 = require("./routes/email");
const db_1 = require("../config/db");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL, // Add your deployed frontend URL here
].filter((v) => Boolean(v)); // Remove undefined values + satisfy TS
app.use((0, cors_1.default)({
    origin: allowedOrigins.length > 0 ? allowedOrigins : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/auth', auth_1.authRoutes);
app.use('/api/emails', email_1.emailRoutes);
// 404 handler (must be before error handler)
app.use(errorHandler_1.notFoundHandler);
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await db_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await db_1.prisma.$disconnect();
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=app.js.map