import "dotenv/config";
import crypto from "crypto";

const algorithm = "aes-256-cbc";

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is missing from your .env file!");
}

const key = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest();

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (combinedText) => {
  const [ivHex, encryptedData] = combinedText.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
