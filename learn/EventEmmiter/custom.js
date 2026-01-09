class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    const listener = this.events[event];
    if (!listener) return;

    listener.forEach((element) => {
      element(...args);
    });
  }

  off(event, listener) {
    const listener1 = this.events[event];
    if (!listener) return;

    this.events[event] = listener1.filter((i) => i !== listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };

    this.on(event, wrapper);
  }
}

const emitter = new EventEmitter();

function onLogin(user) {
  console.log("User logged in:", user);
}

emitter.on("login", onLogin);

emitter.emit("login", "Rahul");
// User logged in: Rahul

emitter.off("login", onLogin);
emitter.emit("login", "Amit");
// (nothing happens)

emitter.once("payment", amount => {
  console.log("Payment received:", amount);
});

emitter.emit("payment", 100);
// Payment received: 100

emitter.emit("payment", 200);
// (nothing happens)
