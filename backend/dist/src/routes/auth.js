"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const client = new google_auth_library_1.OAuth2Client(env_1.env.google.clientId);
// Google OAuth verification and user creation/login
router.post('/google', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new errorHandler_1.AppError('Google ID token is required', 400);
    }
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: env_1.env.google.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        throw new errorHandler_1.AppError('Invalid Google token or missing email', 400);
    }
    const { email, name, picture: avatarUrl } = payload;
    // Find or create user
    let user = await db_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        user = await db_1.prisma.user.create({
            data: {
                email,
                name: name || null,
                avatarUrl: avatarUrl || null,
            },
        });
    }
    else {
        // Update user info if changed
        user = await db_1.prisma.user.update({
            where: { email },
            data: {
                name: name || user.name,
                avatarUrl: avatarUrl || user.avatarUrl,
            },
        });
    }
    // Generate JWT token
    const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, env_1.env.jwt.secret, { expiresIn: '7d' });
    res.json({
        token: jwtToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
        },
    });
}));
// Get current user profile
router.get('/me', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errorHandler_1.AppError('User not authenticated', 401);
    }
    const user = await db_1.prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404);
    }
    res.json({ user });
}));
//# sourceMappingURL=auth.js.map