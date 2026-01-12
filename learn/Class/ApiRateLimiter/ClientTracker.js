class ClientTracker {
  constructor() {
    this.store = new Map();
  }

  getUserRequests(userId) {
    if (!this.store.has(userId)) {
      this.store.set(userId, []);
    }
    return this.store.get(userId);
  }

  addRequest(userId, timeStamp) {
    this.getUserRequests(userId).push(timeStamp);
  }

  removeOldRequests(userId, windowStart) {
    const requests = this.getUserRequests(userId);

    while (requests.length && requests[0] < windowStart) {
      requests.shift();
    }
  }

  getRequestCounts(userId) {
    return this.getUserRequests(userId).length;
  }
}

export default ClientTracker;
