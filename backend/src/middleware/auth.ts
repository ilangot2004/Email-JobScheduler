import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from './errorHandler';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// JWT Authentication Middleware
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return next(new AppError('Access token required. Please provide a valid JWT token.', 401));
  }

  // Verify token
  jwt.verify(token, env.jwt.secret, (err: any, decoded: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Token has expired. Please login again.', 401));
      } else if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token. Please provide a valid JWT token.', 403));
      } else {
        return next(new AppError('Token verification failed.', 403));
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

// Optional authentication (doesn't throw error if no token)
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, env.jwt.secret, (err: any, decoded: any) => {
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
