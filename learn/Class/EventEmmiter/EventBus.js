import Event from "./Event.js";
import Listner from "./Listner.js";

class EventBus {
  constructor() {
    this.events = new Map();
  }

  getListeners(eventName) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    return this.events.get(eventName);
  }
  on(eventName, callback) {
    const listner = new Listner(callback);

    this.getListeners(eventName).push(listner);
  }

  once(eventName, callback) {
    const listner = new Listner(callback, true);
    this.getListeners(eventName).push(listner);
  }

  removeListner(eventName, callback) {
    const listner = this.getListeners(eventName);
    this.events.set(
      eventName,
      listner.filter((e) => e.callback != callback)
    );
  }

  async emit(eventName, payload) {
    const event = new Event(eventName, payload);
    const listeners = this.getListeners(eventName);

    for (let listner of [...listeners]) {
      await listner.callback(event);

      if (listner.once) {
        this.removeListner(eventName, listner.callback);
      }
    }
  }
}

export default EventBus;
