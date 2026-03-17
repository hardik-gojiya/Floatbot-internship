import express from "express";
import {
  deleteWatch,
  gmailWebhook,
  refreshWatch,
  updateWatchfornext24hours,
} from "../controllers/gmailController.js";
import { verifyPubSub } from "../middlewares/pubsub.middleware.js";
import { fetchFailedJobs } from "../services/queueService.js";

const router = express.Router();

router.post("/gmail", verifyPubSub, gmailWebhook);
router.delete("/gmail/delete-watch", deleteWatch);
router.post("/gmail/refresh-watch", refreshWatch);
router.post("/gmail/update-watch-for-next-24-hours", updateWatchfornext24hours);

router.get("/gmail/failed-jobs", async (req, res) => {
  try {
    const failedJobs = await fetchFailedJobs();
    res.status(200).json(failedJobs);
  } catch (error) {
    console.error("[Webhook] Error fetching failed jobs:", error);
    res.status(500).send("error");
  }
});

export default router;
