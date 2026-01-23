import { Router } from 'express';
import { Queue } from 'bullmq';
import { prisma } from '../../config/db';
import { bullRedis } from '../../config/redis';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

// Create email queue (use BullMQ-specific Redis connection)
const emailQueue = new Queue('email-queue', { connection: bullRedis });

// Schedule email campaign
router.post('/schedule', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const {
    subject,
    body,
    recipients,
    startTime,
    delayBetweenEmailsSeconds,
    hourlyLimit
  } = req.body;

  // Validation
  if (!subject || !body || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
    throw new AppError('Missing required fields: subject, body, and recipients are required', 400);
  }

  if (delayBetweenEmailsSeconds === undefined || delayBetweenEmailsSeconds === null || delayBetweenEmailsSeconds < 2) {
    throw new AppError('Delay between emails must be at least 2 seconds', 400);
  }

  if (hourlyLimit === undefined || hourlyLimit === null || hourlyLimit < 1 || hourlyLimit > 500) {
    throw new AppError('Hourly limit must be between 1 and 500', 400);
  }

  const startDate = new Date(startTime);
  if (isNaN(startDate.getTime())) {
    throw new AppError('Invalid start time format', 400);
  }

  if (startDate <= new Date()) {
    throw new AppError('Start time must be in the future', 400);
  }

    // Create campaign
    const campaign = await prisma.emailCampaign.create({
      data: {
        userId: req.user.userId,
        subject,
        body,
        startTime: startDate,
        delayBetweenEmailsSeconds,
        hourlyLimit,
        status: 'scheduled',
      },
    });

    // Create email jobs
    const emailJobs = [];
    let currentTime = startDate;

    for (const recipientEmail of recipients) {
      const job = await prisma.emailJob.create({
        data: {
          campaignId: campaign.id,
          recipientEmail,
          scheduledTime: currentTime,
          status: 'scheduled',
        },
      });

      emailJobs.push(job);

      // Calculate next email time
      currentTime = new Date(currentTime.getTime() + delayBetweenEmailsSeconds * 1000);
    }

    // Add jobs to BullMQ queue
    for (const job of emailJobs) {
      const delay = Math.max(0, job.scheduledTime.getTime() - Date.now());

      await emailQueue.add(
        'send-email',
        {
          emailJobId: job.id,
          campaignId: campaign.id,
          recipientEmail: job.recipientEmail,
          subject: campaign.subject,
          body: campaign.body,
        },
        {
          delay,
          jobId: job.id, // Ensures no duplicates
          removeOnComplete: 100,
          removeOnFail: 50,
        }
      );
    }

    res.json({
      campaign: {
        id: campaign.id,
        subject: campaign.subject,
        recipientCount: recipients.length,
        startTime: campaign.startTime,
        status: campaign.status,
      },
      message: `Campaign scheduled successfully. ${recipients.length} emails will be sent.`,
    });
}));

// Get scheduled emails
router.get('/scheduled', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const emails = await prisma.emailJob.findMany({
    where: {
      campaign: {
        userId: req.user.userId,
      },
      status: 'scheduled',
    },
    include: {
      campaign: {
        select: {
          subject: true,
          body: true,
          status: true,
        },
      },
    },
    orderBy: {
      scheduledTime: 'asc',
    },
    take: 100,
  });

  res.json({
    emails: emails.map(email => ({
      id: email.id,
      recipientEmail: email.recipientEmail,
      subject: email.campaign.subject,
      body: email.campaign.body,
      scheduledTime: email.scheduledTime,
      status: email.status,
    })),
  });
}));

// Get sent/failed emails
router.get('/sent', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const emails = await prisma.emailJob.findMany({
    where: {
      campaign: {
        userId: req.user.userId,
      },
      status: { in: ['sent', 'failed'] },
    },
    include: {
      campaign: {
        select: {
          subject: true,
          body: true,
          status: true,
        },
      },
    },
    orderBy: {
      sentTime: 'desc',
    },
    take: 100,
  });

  res.json({
    emails: emails.map(email => ({
      id: email.id,
      recipientEmail: email.recipientEmail,
      subject: email.campaign.subject,
      body: email.campaign.body,
      sentTime: email.sentTime,
      status: email.status,
      error: email.error,
    })),
  });
}));

// Get campaign statistics
router.get('/stats', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const campaigns = await prisma.emailCampaign.findMany({
    where: {
      userId: req.user.userId,
    },
    include: {
      _count: {
        select: {
          jobs: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const stats = await Promise.all(
    campaigns.map(async (campaign) => {
      const jobStats = await prisma.emailJob.groupBy({
        by: ['status'],
        where: { campaignId: campaign.id },
        _count: { status: true },
      });

      const statusCounts = jobStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>);

      return {
        id: campaign.id,
        subject: campaign.subject,
        status: campaign.status,
        totalJobs: campaign._count.jobs,
        scheduled: statusCounts.scheduled || 0,
        sent: statusCounts.sent || 0,
        failed: statusCounts.failed || 0,
        retrying: statusCounts.retrying || 0,
        createdAt: campaign.createdAt,
      };
    })
  );

  res.json({ campaigns: stats });
}));

// Get single email detail (must be last, after /scheduled, /sent, and /stats routes)
router.get('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  const email = await prisma.emailJob.findFirst({
    where: {
      id,
      campaign: {
        userId: req.user.userId,
      },
    },
    include: {
      campaign: {
        select: {
          subject: true,
          body: true,
          status: true,
        },
      },
    },
  });

  if (!email) {
    throw new AppError('Email not found', 404);
  }

  res.json({
    id: email.id,
    recipientEmail: email.recipientEmail,
    subject: email.campaign.subject,
    body: email.campaign.body,
    scheduledTime: email.scheduledTime,
    sentTime: email.sentTime,
    status: email.status,
    error: email.error,
  });
}));

export { router as emailRoutes };