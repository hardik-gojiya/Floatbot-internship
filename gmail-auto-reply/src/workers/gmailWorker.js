import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { processNewEmails } from "../services/gmailService.js";

const GMAIL_QUEUE_NAME = "gmail-tasks";

export const gmailWorker = new Worker(
  GMAIL_QUEUE_NAME,
  async (job) => {
    const { email, historyId } = job.data;
    console.log(`[Worker] Processing job ${job.id} for email: ${email}`);

    try {
      await processNewEmails(email, historyId);
      console.log(`[Worker] Job ${job.id} completed successfully`);
    } catch (error) {
      console.error(`[Worker] Job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  },
);

gmailWorker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} has completed!`);
});

gmailWorker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job.id} has failed with ${err.message}`);
});

export default gmailWorker;
