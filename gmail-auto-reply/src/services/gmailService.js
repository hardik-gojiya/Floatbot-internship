import { gmailWith, getOAuthClient } from "../config/google.js";
import dotenv from "dotenv";
import { sendAutoReply, sendAutoReplywithNodeMailer } from "./replyService.js";
import { getUserDB, saveUserDB } from "../utils/db.js";
import { User } from "../models/user.model.js";
import { ReplySended } from "../models/replysended.model.js";

dotenv.config();

export const createWatch = async (email) => {
  try {
    console.log("[Gmail] createWatch start");
    let auth = getOAuthClient();
    if (email) {
      const dbUser = await getUserDB(email);
      if (dbUser?.tokens) {
        auth = getOAuthClient({ email, tokens: dbUser.tokens });
      }
    }
    const client = gmailWith(auth);
    const res = await client.users.watch({
      userId: "me",
      requestBody: {
        topicName: process.env.PUBSUB_TOPIC,
        labelIds: ["INBOX"],
        historyTypes: ["messageAdded"],
      },
    });
    console.log("[watch] createWatch res:", res.data);

    console.log("[Gmail] createWatch complete", {
      historyId: res.data.historyId,
    });
    if (email && res?.data?.expiration) {
      await saveUserDB({
        email,
        historyId: res.data.historyId,
        watchExpiration: res.data.expiration,
      });
    }
    return res.data;
  } catch (error) {
    console.error("[Gmail] Error creating watch:", error);
    throw error;
  }
};

export const deletWatch = async (email) => {
  try {
    const user = await getUserDB(email);
    if (!user?.tokens) {
      throw new Error("Missing tokens for email");
    }
    const auth = getOAuthClient({ email, tokens: user.tokens });
    const client = gmailWith(auth);
    await client.users.stop({ userId: "me" });
    console.log("[Gmail] deleteWatch complete");
    return { ok: true };
  } catch (error) {
    console.error("[Gmail] Error deleting watch:", error);
    throw error;
  }
};

export const FetchUsersWatchExpirationinNext24Hours = async () => {
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const users = await User.find({
      watchExpiration: {
        $lt: next24Hours.getTime().toString(),
      },
    });
    console.log(`[Gmail] Found ${users.length} users with watch expiring soon.`);
    return users;
  } catch (error) {
    console.error("[Gmail] Error fetching users with expiring watch:", error);
    return [];
  }
};

export const updateAllUsersWatch = async () => {
  try {
    const users = await FetchUsersWatchExpirationinNext24Hours();
    console.log(`[Gmail] Starting watch update for ${users.length} users.`);

    for (const user of users) {
      try {
        console.log(`[Gmail] Updating watch for user: ${user.email}`);
        await deletWatch(user.email);
        const createWatchRef = await createWatch(user.email);

        if (createWatchRef?.expiration) {
          await saveUserDB({
            email: user.email,
            watchExpiration: createWatchRef.expiration,
          });
          console.log(`[Gmail] Watch expiration updated for ${user.email}`);
        } else {
          console.log(`[Gmail] Error creating watch for user ${user.email}`);
        }
      } catch (error) {
        console.error(`[Gmail] Error updating watch for user ${user.email}:`, error);
      }
    }
    console.log("[Gmail] Finished updating user watches.");
    return { message: "Watch expiration update process completed.", count: users.length };
  } catch (error) {
    console.error("[Gmail] Error in updateAllUsersWatch:", error);
  }
};

export const processNewEmails = async (email, notificationHistoryId) => {
  console.log("[Gmail] processNewEmails start");

  const user = await getUserDB(email);

  if (!user?.tokens) {
    console.log("[Gmail] Missing user tokens, skipping processing");
    return;
  }

  const auth = getOAuthClient({ email, tokens: user.tokens });
  const client = gmailWith(auth);

  const startHistoryId = user.historyId;

  if (!startHistoryId) {
    if (notificationHistoryId) {
      console.log("[Gmail] No stored historyId, saving notification historyId");
      await saveUserDB({ email, historyId: notificationHistoryId });
    } else {
      console.log("[Gmail] Missing historyId, skipping processing");
    }
    return;
  }

  console.log("[Gmail] Fetching history", { startHistoryId });

  let pageToken = undefined;
  let latestHistoryId = notificationHistoryId;

  try {
    do {
      const history = await client.users.history.list({
        userId: "me",
        startHistoryId,
        historyTypes: ["messageAdded"],
        labelId: "INBOX",
        pageToken,
      });

      const historyRecords = history.data.history || [];
      console.log("historyRecords:", historyRecords);

      if (!historyRecords.length) {
        console.log("[Gmail] No new history records");
      }

      latestHistoryId = notificationHistoryId || history.data.historyId;

      for (const record of historyRecords) {
        if (!record.messagesAdded) continue;

        await Promise.all(
          record.messagesAdded.map(async (msg) => {
            try {
              const messageId = msg.message.id;

              console.log("[Gmail] Fetching message", { messageId });

              const message = await client.users.messages.get({
                userId: "me",
                id: messageId,
                format: "full",
                metadataHeaders: [
                  "From",
                  "Subject",
                  "Message-Id",
                  "Message-ID",
                  "Auto-Submitted",
                  "Precedence",
                  "List-Id",
                  "X-Auto-Response-Suppress",
                ],
              });

              const headers = message.data.payload?.headers || [];

              const getHeader = (name) =>
                headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
                  ?.value;

              const autoSubmitted = getHeader("Auto-Submitted");
              const precedence = getHeader("Precedence");
              const listId = getHeader("List-Id");
              const autoSuppress = getHeader("X-Auto-Response-Suppress");

              if (
                autoSubmitted?.toLowerCase() === "auto-generated" ||
                precedence?.toLowerCase() === "bulk" ||
                listId ||
                autoSuppress
              ) {
                console.log("[Gmail] Skipping auto-generated/bulk/list email", {
                  messageId,
                  autoSubmitted,
                  precedence,
                  listId,
                });
                return;
              }

              const parsedMessage = parseGmailMessage(message.data);

              console.log("parsedMessage:", parsedMessage);

              const body = parsedMessage.text || parsedMessage.snippet;
              console.log("message body:", body);

              const labelIds = parsedMessage.labelIds || [];

              const isInbox = labelIds.includes("INBOX");
              const isSent = labelIds.includes("SENT");
              const isDraft = labelIds.includes("DRAFT");
              const isSpam = labelIds.includes("SPAM");
              const isTrash = labelIds.includes("TRASH");

              if (!isInbox || isSent || isDraft || isSpam || isTrash) {
                console.log("[Gmail] Skipping message", {
                  messageId,
                  labelIds,
                });
                return;
              }

              const userEmail = (email || "").toLowerCase();
              const fromValue = (parsedMessage.from || "").toLowerCase();

              if (userEmail && fromValue.includes(userEmail)) {
                console.log("[Gmail] Skipping self-sent message", {
                  messageId,
                });
                return;
              }

              await handleEmail(parsedMessage, client, body);
            } catch (err) {
              console.error("[Gmail] Error processing message", err);
            }
          }),
        );
      }

      pageToken = history.data.nextPageToken;
    } while (pageToken);
  } catch (err) {
    if (err?.code === 404) {
      console.log("[Gmail] HistoryId too old, resync needed", {
        startHistoryId,
      });

      if (notificationHistoryId) {
        await saveUserDB({ email, historyId: notificationHistoryId });
      }

      return;      
    }

    console.error("[Gmail] History fetch failed", err);
    throw err;
  }

  if (latestHistoryId) {
    console.log("[Gmail] Saving new historyId", { latestHistoryId });
    await saveUserDB({ email, historyId: latestHistoryId });
  }

  console.log("[Gmail] processNewEmails complete");
};

const handleEmail = async (parsedMessage, gmailClient, body) => {
  try {
    console.log("[Gmail] handleEmail start", { id: parsedMessage.id });

    const from = parsedMessage.from;
    const subject = parsedMessage.subject;
    const originalMessageId = parsedMessage.messageId;
    const threadId = parsedMessage.threadId;
    const historyId = parsedMessage.historyId;
    const name = parsedMessage.name || "";

    if (!from) {
      console.log("[Gmail] Missing From header, skipping reply");
      return;
    }

    if (!originalMessageId) {
      console.log("[Gmail] Missing Message-Id header, skipping reply");
      return;
    }

    // Check if reply already sent for this message
    const existingReply = await ReplySended.findOne({ originalMessageId });
    if (existingReply) {
      console.log(
        "[Gmail] Reply already sent for messageId:",
        originalMessageId,
      );
      return;
    }

    console.log("[Gmail] Sending auto-reply", { from, subject });
    await sendAutoReply(
      from,
      subject,
      {
        threadId,
        originalMessageId,
        gmailClient,
      },
      body,
      name,
    );

    // Save record to prevent duplicate replies
    await ReplySended.create({
      threadId,
      originalMessageId,
      historyId,
    });

    console.log("[Gmail] handleEmail complete");
  } catch (error) {
    console.error("[Gmail] handleEmail error:", error);
    throw error;
  }
};

export function parseGmailMessage(message) {
  const payload = message.payload || {};
  const headers = payload.headers || [];

  const getHeader = (name) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ||
    "";

  let text = "";
  let html = "";
  const attachments = [];

  function decode(data) {
    if (!data) return "";
    return Buffer.from(data, "base64").toString("utf-8");
  }

  function parseParts(parts) {
    for (const part of parts) {
      if (part.parts) {
        parseParts(part.parts);
        continue;
      }

      const mime = part.mimeType;

      if (mime === "text/plain") {
        text += decode(part.body?.data);
      }

      if (mime === "text/html") {
        html += decode(part.body?.data);
      }

      if (part.filename) {
        attachments.push({
          filename: part.filename,
          mimeType: mime,
          attachmentId: part.body?.attachmentId,
          size: part.body?.size,
        });
      }
    }
  }

  if (payload.parts) {
    parseParts(payload.parts);
  } else {
    if (payload.mimeType === "text/plain") text = decode(payload.body?.data);
    if (payload.mimeType === "text/html") html = decode(payload.body?.data);
  }

  return {
    id: message.id,
    threadId: message.threadId,
    historyId: message.historyId,

    subject: getHeader("Subject"),
    from: getHeader("From"),
    to: getHeader("To"),
    cc: getHeader("Cc"),
    date: getHeader("Date"),
    messageId: getHeader("Message-Id"),
    name: getHeader("From").match(/([^<]+)/)?.[1] || "",

    text,
    html,

    attachments,

    snippet: message.snippet,
    labelIds: message.labelIds || [],
  };
}
