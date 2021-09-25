import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { multiplayer } from "./dist/multiplayer.cjs";

import {
  assetsMiddleware,
  prerenderedMiddleware,
  kitMiddleware,
} from "./build/middlewares.js";

const { PORT = 8080 } = process.env;
const app = express();
const server = createServer(app);

multiplayer(new Server(server));
app.use(assetsMiddleware, prerenderedMiddleware, kitMiddleware);

server.listen(PORT, () => {
  process.stdout.write(`Multiplayer Dice Game running on :${PORT}\n`);
});
