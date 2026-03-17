import { Queue } from "bullmq";

import redis from "../config/redis.js";

const testQueue = new Queue("test-queue", {
  connection: redis,
});
export default testQueue;

