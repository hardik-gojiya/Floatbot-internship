import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
};

export const connection = new IORedis(redisConfig);

connection.on("connect", () => {
  console.log("[Redis] Connected to Redis server");
});

connection.on("error", (err) => {
  console.error("[Redis] Error connecting to Redis:", err);
});

export default connection;
