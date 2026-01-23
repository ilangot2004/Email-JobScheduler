import { Worker, Job } from 'bullmq';
import { redis, bullConnection } from '../../config/redis';
import { prisma } from '../../config/db';
import { env } from '../../config/env';

// Import nodemailer using require for CommonJS compatibility
const nodemailer = require('nodemailer');

// Create Ethereal email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: env.email.etherealUser,
      pass: env.email.etherealPass,
    },
  });
};

// Rate limiting: Check hourly limit per sender
const checkHourlyLimit = async (campaignId: string): Promise<boolean> => {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) return false;

  const now = new Date();
  const hourKey = `email_rate:${campaign.userId}:${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}`;

  const count = await redis.incr(hourKey);

  // Set expiry for the key (1 hour from now)
  if (count === 1) {
    await redis.expire(hourKey, 3600);
  }

  return count <= campaign.hourlyLimit;
};

// Calculate delay until next hour when limit is exceeded
const getDelayUntilNextHour = (): number => {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  return nextHour.getTime() - now.getTime();
};

// Email processor function
const sendEmailProcessor = async (job: Job) => {
  const { emailJobId, campaignId, recipientEmail, subject, body } = job.data;

  console.log(`\n📬 Processing email job: ${emailJobId}`);
  console.log(`   Recipient: ${recipientEmail}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Scheduled time: ${job.timestamp ? new Date(job.timestamp).toISOString() : 'N/A'}`);

  try {
    // Check if job was already processed (idempotency)
    const emailJob = await prisma.emailJob.findUnique({
      where: { id: emailJobId },
    });

    if (!emailJob) {
      console.log(`⚠️ Email job ${emailJobId} not found in database`);
      return;
    }

    if (emailJob.status === 'sent') {
      console.log(`ℹ️ Email job ${emailJobId} already processed (status: sent)`);
      return;
    }

    console.log(`   Current status: ${emailJob.status}`);

    // Check hourly rate limit
    const withinLimit = await checkHourlyLimit(campaignId);
    if (!withinLimit) {
      const delay = getDelayUntilNextHour();
      console.log(`Rate limit exceeded for campaign ${campaignId}, delaying ${delay}ms`);

      // Re-queue the job with delay
      throw new Error(`RATE_LIMIT_EXCEEDED:${delay}`);
    }

    // Send email
    const transporter = createTransporter();

    const mailOptions = {
      from: '"Email Scheduler" <scheduler@example.com>',
      to: recipientEmail,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);

    // Update job status
    await prisma.emailJob.update({
      where: { id: emailJobId },
      data: {
        status: 'sent',
        sentTime: new Date(),
      },
    });

    console.log(`✅ Email sent to ${recipientEmail}`);
    try {
      if (info && nodemailer.getTestMessageUrl) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log(`📧 Preview URL: ${previewUrl}`);
        }
      }
    } catch (err) {
      // Preview URL not available, continue
    }

    // Check if campaign is complete
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });

    if (campaign) {
      const completedJobs = await prisma.emailJob.count({
        where: {
          campaignId,
          status: { in: ['sent', 'failed'] },
        },
      });

      if (completedJobs === campaign._count.jobs) {
        await prisma.emailCampaign.update({
          where: { id: campaignId },
          data: { status: 'completed' },
        });
        console.log(`🎉 Campaign ${campaignId} completed`);
      }
    }

  } catch (error: any) {
    console.error(`❌ Failed to send email ${emailJobId}:`, error);

    // Handle rate limiting
    if (error.message.startsWith('RATE_LIMIT_EXCEEDED:')) {
      const delay = parseInt(error.message.split(':')[1]);

      // Update job status to retrying
      await prisma.emailJob.update({
        where: { id: emailJobId },
        data: {
          status: 'retrying',
          error: `Rate limit exceeded, retrying in ${Math.ceil(delay / 1000)} seconds`,
        },
      });

      // Re-queue with delay
      throw new Error(`RATE_LIMIT_EXCEEDED:${delay}`);
    }

    // Update job status to failed
    await prisma.emailJob.update({
      where: { id: emailJobId },
      data: {
        status: 'failed',
        error: error.message,
      },
    });

    throw error;
  }
};

// Create and configure the worker
export const createEmailWorker = () => {
  const worker = new Worker(
    'email-queue',
    sendEmailProcessor,
    {
      connection: bullConnection, // Use BullMQ connection options
      concurrency: env.worker.concurrency,
      limiter: {
        max: 1,
        duration: 2000, // Minimum 2 seconds between emails
      },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
    if (err.stack) {
      console.error('Stack trace:', err.stack);
    }
  });

  worker.on('stalled', (jobId) => {
    console.warn(`⚠️ Job ${jobId} stalled - retrying...`);
  });

  worker.on('active', (job) => {
    console.log(`🔄 Processing job ${job.id} for email: ${job.data.recipientEmail}`);
  });

  worker.on('error', (err) => {
    console.error('❌ Worker error:', err);
  });

  console.log(`🚀 Email worker started with concurrency: ${env.worker.concurrency}`);
  console.log(`📧 Listening for jobs in queue: email-queue`);
  console.log(`⏰ Ready to process scheduled emails...`);

  return worker;
};