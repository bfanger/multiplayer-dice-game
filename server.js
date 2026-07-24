/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import 'varlock/auto-load';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import multiplayer from "./dist/multiplayer.js";
import { handler } from "./build/handler.js";

const { PORT = 1888 } = process.env;
const app = express();
const server = createServer(app);

multiplayer(new Server(server));
app.use(handler);

server.listen(PORT, () => {
  process.stdout.write(`Multiplayer Dice Game running on :${PORT}\n`);
});
