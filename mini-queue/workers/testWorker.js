import { Worker } from "bullmq";
import redis from "../config/redis.js";

const worker = new Worker(
  "test-queue",
  async (job) => {
    console.log("Processing job...");
    console.log("Job data:", job.data);

    if (job.data.fail) {
      throw new Error("Simulated job failure");
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Job finished:", job.id);
  },
  {
    connection: redis,
  },
);
console.log("Worker is running");

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed:`, err.message);
});
