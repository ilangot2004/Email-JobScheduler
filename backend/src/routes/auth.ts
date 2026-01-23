import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const client = new OAuth2Client(env.google.clientId);

// Google OAuth verification and user creation/login
router.post('/google', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Google ID token is required', 400);
  }

  // Verify the Google ID token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: env.google.clientId,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new AppError('Invalid Google token or missing email', 400);
  }

  const { email, name, picture: avatarUrl } = payload;

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        avatarUrl: avatarUrl || null,
      },
    });
  } else {
    // Update user info if changed
    user = await prisma.user.update({
      where: { email },
      data: {
        name: name || user.name,
        avatarUrl: avatarUrl || user.avatarUrl,
      },
    });
  }

  // Generate JWT token
  const jwtToken = jwt.sign(
    { userId: user.id, email: user.email },
    env.jwt.secret,
    { expiresIn: '7d' }
  );

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
router.get('/me', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const user = await prisma.user.findUnique({
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
    throw new AppError('User not found', 404);
  }

  res.json({ user });
}));

export { router as authRoutes };