class RateLimiter {
  constructor(rule, tracker) {
    this.rule = rule;
    this.tracker = tracker;
  }

  check(userId) {
    console.log(this.rule);
    const now = Date.now();
    const windowStart = now - this.rule.windowSize;


    this.tracker.removeOldRequests(userId, windowStart);

    const count = this.tracker.getRequestCounts(userId);

    if (count >= this.rule.maxRequests) {
      return {
        allowed: false,
        retryAfter: this.rule.windowSize / 60000,
      };
    }

    this.tracker.addRequest(userId, now);

    return {
      allowed: true,
      remaining: this.rule.maxRequests - count - 1,
    };
  }
}

export default RateLimiter;
