import EventBus from "./EventBus.js";

const bus = new EventBus();

const loginHandler = async (event) => {
  console.log("Login:", event.payload.user);
};

bus.on("login", loginHandler);

bus.once("login", () => {
  console.log("Welcome!");
});

bus.emit("login", { user: "Amit" });
bus.emit("login", { user: "Amit" });

bus.removeListner("login", loginHandler);
