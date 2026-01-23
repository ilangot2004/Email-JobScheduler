"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
// Import nodemailer using require for CommonJS compatibility
const nodemailer = require('nodemailer');
// Create Ethereal email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: env_1.env.email.etherealUser,
            pass: env_1.env.email.etherealPass,
        },
    });
};
// Rate limiting: Check hourly limit per sender
const checkHourlyLimit = async (campaignId) => {
    const campaign = await db_1.prisma.emailCampaign.findUnique({
        where: { id: campaignId },
    });
    if (!campaign)
        return false;
    const now = new Date();
    const hourKey = `email_rate:${campaign.userId}:${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}`;
    const count = await redis_1.redis.incr(hourKey);
    // Set expiry for the key (1 hour from now)
    if (count === 1) {
        await redis_1.redis.expire(hourKey, 3600);
    }
    return count <= campaign.hourlyLimit;
};
// Calculate delay until next hour when limit is exceeded
const getDelayUntilNextHour = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    return nextHour.getTime() - now.getTime();
};
// Email processor function
const sendEmailProcessor = async (job) => {
    const { emailJobId, campaignId, recipientEmail, subject, body } = job.data;
    console.log(`\n📬 Processing email job: ${emailJobId}`);
    console.log(`   Recipient: ${recipientEmail}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Scheduled time: ${job.timestamp ? new Date(job.timestamp).toISOString() : 'N/A'}`);
    try {
        // Check if job was already processed (idempotency)
        const emailJob = await db_1.prisma.emailJob.findUnique({
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
        await db_1.prisma.emailJob.update({
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
        }
        catch (err) {
            // Preview URL not available, continue
        }
        // Check if campaign is complete
        const campaign = await db_1.prisma.emailCampaign.findUnique({
            where: { id: campaignId },
            include: {
                _count: {
                    select: { jobs: true },
                },
            },
        });
        if (campaign) {
            const completedJobs = await db_1.prisma.emailJob.count({
                where: {
                    campaignId,
                    status: { in: ['sent', 'failed'] },
                },
            });
            if (completedJobs === campaign._count.jobs) {
                await db_1.prisma.emailCampaign.update({
                    where: { id: campaignId },
                    data: { status: 'completed' },
                });
                console.log(`🎉 Campaign ${campaignId} completed`);
            }
        }
    }
    catch (error) {
        console.error(`❌ Failed to send email ${emailJobId}:`, error);
        // Handle rate limiting
        if (error.message.startsWith('RATE_LIMIT_EXCEEDED:')) {
            const delay = parseInt(error.message.split(':')[1]);
            // Update job status to retrying
            await db_1.prisma.emailJob.update({
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
        await db_1.prisma.emailJob.update({
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
const createEmailWorker = () => {
    const worker = new bullmq_1.Worker('email-queue', sendEmailProcessor, {
        connection: redis_1.bullConnection, // Use BullMQ connection options
        concurrency: env_1.env.worker.concurrency,
        limiter: {
            max: 1,
            duration: 2000, // Minimum 2 seconds between emails
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
    });
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
    console.log(`🚀 Email worker started with concurrency: ${env_1.env.worker.concurrency}`);
    console.log(`📧 Listening for jobs in queue: email-queue`);
    console.log(`⏰ Ready to process scheduled emails...`);
    return worker;
};
exports.createEmailWorker = createEmailWorker;
//# sourceMappingURL=emailWorker.js.map