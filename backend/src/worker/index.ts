import { createEmailWorker } from './emailWorker';

// Start the email worker
export const worker = createEmailWorker();

// Graceful shutdown (only if running as standalone worker process)
// If running in API process (ENABLE_WORKER=true), server.ts handles shutdown
if (!process.env.ENABLE_WORKER) {
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down worker gracefully');
    await worker.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down worker gracefully');
    await worker.close();
    process.exit(0);
  });
}