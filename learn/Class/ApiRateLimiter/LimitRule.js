class LimitRule {
  constructor({ windowSize, maxRequests }) {
    this.windowSize = windowSize;
    this.maxRequests = maxRequests;
  }
}

export default LimitRule;
