import testQueue from "./queues/testQueue.js";

async function checkJob() {
  const jobId = "21";

  const job = await testQueue.getJob(jobId);

  if (!job) {
    console.log("Job not found");
    process.exit(0);
  }

  const state = await job.getState();

  console.log("Job ID:", jobId);
  console.log("Status:", state);

  process.exit(0);
}

checkJob();
