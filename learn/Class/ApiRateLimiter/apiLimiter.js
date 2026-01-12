import express from "express";
import ClientTracker from "./ClientTracker.js";
import RateLimiter from "./RateLimiter.js";
import LimitRule from "./LimitRule.js";

const app = express();

const rule = new LimitRule({
  windowSize: 60000,
  maxRequests: 5,
});

const tracker = new ClientTracker();
const limiter = new RateLimiter(rule, tracker);

const limiterMiddlerware = (req, res, next) => {
  const userId = req.ip;

  const result = limiter.check(userId);

  if (!result.allowed) {
    return res.json({
      error: "Too many requests",
      retryAfter: `${result.retryAfter} Minutes`,
    });
  }

  req.rateLimit = result.remaining;
  next();
};

app.get("/api", limiterMiddlerware, (req, res) => {

  return res.json({
    message: "Hello, this is api rate limiter api",
    remaining: req.rateLimit.remaining,
  });
});

app.listen(3000, () => {
  console.log(`Server Started: http://localhost:${3000}`);
});
