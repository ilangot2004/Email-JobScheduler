import app from './app';
import { env } from '../config/env';
import { prisma } from '../config/db';

const PORT = env.server.port;

// Conditionally start worker if ENABLE_WORKER is set
let workerInstance: any = null;

if (process.env.ENABLE_WORKER === 'true') {
  console.log('🔄 Starting email worker in API process...');
  // Dynamically import worker to start it
  import('./worker/index').then((workerModule) => {
    workerInstance = workerModule.worker;
    console.log('✅ Email worker started successfully');
  }).catch((err) => {
    console.error('❌ Failed to start worker:', err);
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Email Scheduler API running on port ${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/health`);
  if (process.env.ENABLE_WORKER === 'true') {
    console.log('👷 Worker is running in the same process');
  }
});

// Enhanced graceful shutdown to handle both API and worker
const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully...`);
  
  // Close worker if it's running
  if (workerInstance) {
    console.log('🛑 Closing email worker...');
    await workerInstance.close();
  }
  
  // Close Prisma connection
  await prisma.$disconnect();
  
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));