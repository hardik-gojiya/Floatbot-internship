import express from "express";
import http, { Server } from "http";
import { server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome.");
});

app.listen(PORT || 8080, () => {
  console.log(`Server Is Running On  http://localhost:${PORT}`);
});
