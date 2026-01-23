import { createEmailWorker } from './emailWorker';

// Start the email worker
const worker = createEmailWorker();

// Graceful shutdown
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