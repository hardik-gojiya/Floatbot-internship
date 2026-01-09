import EventEmitter from "events";

const emmiter = new EventEmitter();

emmiter.on("hello", () => {
  console.log("Hello");
});

emmiter.emit("hello");

emmiter.on("async-event", () => {
  setImmediate(() => {
    console.log("Async Event");
  });
});

console.log("Start");
emmiter.emit("async-event");
console.log("End");

