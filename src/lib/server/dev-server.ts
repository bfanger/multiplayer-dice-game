import express from "express";
import { Server } from "socket.io";
import http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import multiplayer from "./multiplayer";

const { PORT = 8080 } = process.env;
const app = express();
const server = http.createServer(app);

// Inject socket.io
const io = new Server(server);

// Add game logic
multiplayer(io);

// Proxy everything (else) to the vite dev server
app.use(
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
  })
);

server.listen(PORT, () => {
  process.stdout.write(
    `\nDice Dev Server running on http://localhost:${PORT}\n`
  );
});
