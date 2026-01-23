"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailWorker_1 = require("./emailWorker");
// Start the email worker
const worker = (0, emailWorker_1.createEmailWorker)();
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
//# sourceMappingURL=index.js.map