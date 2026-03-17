import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

const EXPECTED_AUDIENCE = process.env.PUBSUB_AUDIENCE;
const EXPECTED_SERVICE_ACCOUNT = process.env.PUBSUB_SERVICE_ACCOUNT;

export const verifyPubSub = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.error("[PubSubAuth] Missing Authorization header");
      return res.status(401).send("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: EXPECTED_AUDIENCE,
    });

    const payload = ticket.getPayload();

    console.log("[PubSubAuth] JWT payload:", payload);

    if (
      payload.email !== EXPECTED_SERVICE_ACCOUNT ||
      payload.email_verified !== true
    ) {
      console.error("[PubSubAuth] Invalid service account");
      return res.status(403).send("Forbidden");
    }
    console.log("[PubSubAuth] Service account verified");
    next();
  } catch (err) {
    console.error("[PubSubAuth] Verification failed:", err);
    return res.status(401).send("Invalid Pub/Sub token");
  }
};
