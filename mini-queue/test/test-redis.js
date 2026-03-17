import redis from "../config/redis.js";

async function test() {
  await redis.set("name", "Hardik");

  const value = await redis.get("name");

  console.log("Stored value:", value);

  process.exit(0);
}

test();
