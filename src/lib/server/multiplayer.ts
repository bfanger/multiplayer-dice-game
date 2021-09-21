import type { Server } from "socket.io";
import { createGame } from "$lib/game-logic/game-fns";
import { playerFromToken } from "$lib/game-logic/player-fns";
import type { Game } from "$lib/game-logic/types";

export const games: Record<string, Game> = {};

export default function multiplayer(io: Server): void {
  io.on("connection", (socket) => {
    try {
      const player = playerFromToken(socket.handshake.auth.token);
      socket.emit("player", player);
      // eslint-disable-next-line no-console
      console.info(player.name, "connected");
      socket.on("host", () => {
        const game = createGame(player);
        games[game.id] = game;
        socket.rooms.add(game.id);
        socket.on("disconnected", () => {
          player.connected = false;
          socket.to(game.id).emit("update", game);
        });
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      socket.disconnect();
    }
  });
}
