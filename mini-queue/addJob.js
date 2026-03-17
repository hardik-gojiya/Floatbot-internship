import testQueue from "./queues/testQueue.js";

async function addJob() {
  const job = await testQueue.add(
    "myFirstJob",
    {
      name: "Hardik",
      fail: true,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    },
  );

  console.log("Job added to the queue", job.id);

  process.exit(0);
}

addJob();
