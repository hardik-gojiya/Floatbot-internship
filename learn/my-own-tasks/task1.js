import http from "http";

http
  .createServer((req, res) => {
    const { method, url } = req;

    if ((method === "GET", url === "/")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Welcome to custom HTTP server" }));
      return;
    }
    if ((method === "GET", url === "/health")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "OK", uptime: process.uptime() }));
      return;
    }
    if ((method === "POST", url === "/echo")) {
    }
  })
  .listen(5000, () => {
    console.log("Server Started on 5000");
  });
