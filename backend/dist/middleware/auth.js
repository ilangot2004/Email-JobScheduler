"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const errorHandler_1 = require("./errorHandler");
// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return next(new errorHandler_1.AppError('Access token required. Please provide a valid JWT token.', 401));
    }
    // Verify token
    jsonwebtoken_1.default.verify(token, env_1.env.jwt.secret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new errorHandler_1.AppError('Token has expired. Please login again.', 401));
            }
            else if (err.name === 'JsonWebTokenError') {
                return next(new errorHandler_1.AppError('Invalid token. Please provide a valid JWT token.', 403));
            }
            else {
                return next(new errorHandler_1.AppError('Token verification failed.', 403));
            }
        }
        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        next();
    });
};
exports.authenticateToken = authenticateToken;
// Optional authentication (doesn't throw error if no token)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, env_1.env.jwt.secret, (err, decoded) => {
            if (!err && decoded) {
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email,
                };
            }
        });
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map