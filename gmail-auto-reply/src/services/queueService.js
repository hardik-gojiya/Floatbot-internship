import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

const GMAIL_QUEUE_NAME = "gmail-tasks";

export const gmailQueue = new Queue(GMAIL_QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const addGmailTask = async (email, historyId) => {
  try {
    const job = await gmailQueue.add("process-new-emails", {
      email,
      historyId,
    });
    console.log(`[Queue] Added job ${job.id} for email: ${email}`);
    return job;
  } catch (error) {
    console.error("[Queue] Error adding job:", error);
    throw error;
  }
};

export const fetchFailedJobs = async () => {
  try {
    const failedJobs = await gmailQueue.getJobs(["failed"], 0, 99, false);
    console.log("[Queue] Failed jobs:", failedJobs.length);
    return failedJobs;
  } catch (error) {
    console.error("[Queue] Error fetching failed jobs:", error);
    throw error;
  }
};
