import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import webhookRoutes from "./src/routes/webhookRoutes.js";
import { connectDB } from "./src/utils/db.js";
import dotenv from "dotenv";
import cron from "./src/services/cron.js";
import "./src/workers/gmailWorker.js";

dotenv.config({ silent: true });

const app = express();
const PORT = 3000;

console.log("[Startup] Initializing server");

try {
  connectDB();
} catch (error) {
  console.error("[Startup] Error initializing server:", error);
  process.exit(1);
}

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/webhook", webhookRoutes);

app.listen(PORT, () => {
  console.log(`[Startup] Server running on port ${PORT}`);
});
