import type { Server } from "socket.io";
import { createGame, startGame, throwDice } from "$lib/game-logic/game-fns";
import { playerFromToken } from "$lib/game-logic/player-fns";
import type { Game } from "$lib/game-logic/types";

export const games: Record<string, Game> = {};

function getGame(id: string): Game {
  const game = games[id];
  if (!game) {
    throw new Error(`Game ${id} not found`);
  }
  return game;
}
function log(...args: unknown[]) {
  const date = new Date();
  // eslint-disable-next-line no-console
  console.info(
    `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`,
    ...args
  );
}
/**
 * Multiplayer Server
 */
export default function multiplayer(io: Server): void {
  io.on("connection", (socket) => {
    try {
      const player = playerFromToken(socket.handshake.auth.token);
      socket.emit("player", player);
      log(player.name, "connected");
      socket.on("host", () => {
        // eslint-disable-next-line no-console
        log(player.name, "created new game");
        const game = createGame(player);
        games[game.id] = game;
        socket.join(game.id);
        socket.emit("game", game);
        socket.on("disconnected", () => {
          player.disconnected = true;
          io.to(game.id).emit("game", game);
        });
      });
      socket.on("start", (id) => {
        try {
          const game = getGame(id);
          startGame(game);
          io.to(id).emit("game", game);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(err);
          socket.emit("error", "start failed");
        }
      });
      socket.on("throw", (id) => {
        try {
          const game = getGame(id);
          throwDice(game, player);
          io.to(id).emit("game", game);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(err);
          socket.emit("error", "start failed");
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      socket.disconnect();
    }
  });
}
