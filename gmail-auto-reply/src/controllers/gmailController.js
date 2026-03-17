import { getOAuthClient, gmailWith } from "../config/google.js";
import {
  deletWatch,
  FetchUsersWatchExpirationinNext24Hours,
  processNewEmails,
  createWatch,
  updateAllUsersWatch,
} from "../services/gmailService.js";
import { getUserDB, saveUserDB } from "../utils/db.js";
import { addGmailTask } from "../services/queueService.js";

export const gmailWebhook = async (req, res) => {
  console.log("[Webhook] Received Gmail webhook");

  try {
    console.log("[Webhook] Request body:", req.body);
    const message = req.body.message;
    console.log("[Webhook] Message data", message);
    if (!message?.data) {
      console.log("[Webhook] No message data in request body");
      res.status(400).send("missing message data");
      return;
    }

    let data;
    try {
      data = JSON.parse(Buffer.from(message.data, "base64").toString());
    } catch (parseError) {
      console.error("[Webhook] Error parsing message data:", parseError);
      res.status(400).send("malformed message data");
      return;
    }

    console.log("[Webhook] Parsed message data:", data);

    console.log("[Webhook] Event payload", {
      emailAddress: data?.emailAddress,
      historyId: data?.historyId,
    });

    const email = data?.emailAddress;
    if (!email) {
      console.log("[Webhook] Missing emailAddress in payload");
      res.status(200).send("ignored");
      return;
    }
    const user = await getUserDB(email);
    if (!user) {
      console.log("[Webhook] No user found for email, ignoring", { email });
      res.status(200).send("ignored");
      return;
    }

    console.log("[Webhook] Adding task to queue");
    await addGmailTask(email, data?.historyId);

    console.log("[Webhook] Task queued successfully");
    res.status(200).send("ok");
  } catch (err) {
    console.error("[Webhook] Error:", err);
    res.status(500).send("error");
  }
};

export const deleteWatch = async (req, res) => {
  try {
    const email = req.query.email || req.body.email;
    if (!email) {
      res.status(400).send("email required");
      return;
    }
    await deletWatch(email);
    res.status(200).send("ok");
  } catch (error) {
    console.error("[Webhook] Error deleting watch:", error);
    res.status(500).send("Error deleting watch");
  }
};

export const refreshWatchfunc = async (email) => {
  const user = await getUserDB(email);

  const auth = getOAuthClient({
    email,
    tokens: user.tokens,
  });

  const client = gmailWith(auth);

  const response = await client.users.watch({
    userId: "me",
    requestBody: {
      topicName: process.env.PUBSUB_TOPIC,
      labelIds: ["INBOX"],
      labelFilterAction: "include",
    },
  });

  await saveUserDB({
    email,
    historyId: response.data.historyId,
  });

  console.log("Watch refreshed for:", email);
};

export const refreshWatch = async (req, res) => {
  try {
    const email = req.query.email || req.body.email;
    if (!email) {
      res.status(400).send("email required");
      return;
    }

    await refreshWatchfunc(email);

    res.status(200).send("ok");
  } catch (error) {
    console.error("[Webhook] Error refreshing watch:", error);
    res.status(500).send("Error refreshing watch");
  }
};

export const updateWatchfornext24hours = async (req, res) => {
  try {
    const result = await updateAllUsersWatch();
    res.status(200).json(result);
  } catch (error) {
    console.error("[Webhook] Error updating watch for next 24 hours:", error);
    res.status(500).send("Error updating watch for next 24 hours");
  }
};
