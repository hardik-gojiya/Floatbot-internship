import express from "express";
import { googleAuth, googleCallback } from "../controllers/authController.js";
import { getAccessToken } from "../config/google.js";
import {  updateAccesTokenDB } from "../utils/db.js";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

router.post("/refreshtoken", async (req, res) => {
  const { refreshToken, email } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }
  const accessTokendata = await getAccessToken(refreshToken);
  if (!accessTokendata) {
    return res.status(400).json({ error: "Failed to get access token" });
  }
  await updateAccesTokenDB(email, accessTokendata);
  return res.json({ accessTokendata });
});

export default router;
