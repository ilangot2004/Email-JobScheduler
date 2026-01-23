import app from './app';
import { env } from '../config/env';

const PORT = env.server.port;

app.listen(PORT, () => {
  console.log(`🚀 Email Scheduler API running on port ${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/health`);
});