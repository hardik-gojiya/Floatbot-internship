import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome.");
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("chat-message", (message) => {
    io.emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id);
  });
});

app.post("/send-message", (req, res) => {
  const { message } = req.body;

  io.emit("chat-message", message);

  res.send({ status: "Message sent" });
});

server.listen(PORT || 5000, () => {
  console.log(`Server Is Running On  http://localhost:${PORT}`);
});

export { io, app, server };
