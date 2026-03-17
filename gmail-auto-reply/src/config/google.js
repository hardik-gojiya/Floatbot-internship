import { google } from "googleapis";
import dotenv from "dotenv";
import { saveUserDB } from "../utils/db.js";
import { decrypt } from "../services/dataencryption.js";

dotenv.config();

export function getOAuthClient(context = {}) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const presetTokens = context?.tokens;
  const presetEmail = context?.email;
  const existing = presetTokens;

  if (existing) {
    oauth2Client.setCredentials(existing);
  }

  oauth2Client.on("tokens", async (tokens) => {
    console.log("[OAuth] New tokens received");

    const current = presetTokens || {};
    const next = { ...current };

    if (tokens.access_token) {
      next.access_token = tokens.access_token;
    }

    if (tokens.refresh_token) {
      next.refresh_token = tokens.refresh_token;
    }

    if (tokens.expiry_date) {
      next.expiry_date = tokens.expiry_date;
    }

    console.log("[OAuth] next Tokens:", next);
    const email = presetEmail || oauth2Client?.credentials?.email || undefined;
    if (email) {
      await saveUserDB({ email, tokens: next });
    }

    console.log("[OAuth] Tokens updated in DB");
  });

  return oauth2Client;
}

export function gmail() {
  const auth = getOAuthClient();

  return google.gmail({
    version: "v1",
    auth,
  });
}

export function gmailWith(auth) {
  return google.gmail({
    version: "v1",
    auth,
  });
}

export async function getAccessToken(refreshToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    refresh_token: decrypt(refreshToken),
  });

  const res = await oauth2Client.getAccessToken();

  if (!res?.res?.data?.access_token) {
    throw new Error("Failed to get access token");
  }
  console.log("[OAuth] getAccessToken:", res?.res?.data);

  return res?.res?.data;
}
