import { gmailWith, getOAuthClient } from "../config/google.js";
import { createWatch } from "../services/gmailService.js";
import { saveUserDB } from "../utils/db.js";

export const googleAuth = async (req, res) => {
  console.log("[Auth] googleAuth start");
  const scopes = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.send",
    "https://mail.google.com/",
  ];

  const url = getOAuthClient().generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  console.log("[Auth] Redirecting to Google consent");
  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  console.log("[Auth] googleCallback start");
  const { code } = req.query;

  console.log("[Auth] Exchanging code for tokens");
  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  console.log("[Auth] Tokens received", tokens);

  console.log("[Auth] Setting OAuth credentials");
  oauth2Client.setCredentials(tokens);

  console.log("[Auth] Fetching Gmail profile");
  const profile = await gmailWith(oauth2Client).users.getProfile({
    userId: "me",
  });

  const email = profile.data.emailAddress;
  const historyId = profile.data.historyId;

  console.log("[Auth] Saving user profile");
  console.log({
    hasTokens: Boolean(tokens),
    email,
    historyId,
  });
  await saveUserDB({ email, tokens, historyId });

  console.log("[Auth] Creating Gmail watch");
  await createWatch(email);

  console.log("[Auth] Gmail connected");
  res.send("Gmail connected successfully");
};
