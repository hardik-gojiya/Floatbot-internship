import express from "express";
import testQueue from "./queues/testQueue.js";

const app = express();
const PORT = 7000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/add-job", async (req, res) => {
  try {
    const job = await testQueue.add(
      "myJob",
      {
        name: req.body.name,
        fail: req.body.fail || false,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    );

    res.json({
      success: true,
      jobId: job.id,
    });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add job",
    });
  }
});

app.get("/check-job/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await testQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const state = await job.getState();

    res.json({
      success: true,
      jobId: job.id,
      state: state,
    });
  } catch (error) {
    console.error("Error checking job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check job",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
