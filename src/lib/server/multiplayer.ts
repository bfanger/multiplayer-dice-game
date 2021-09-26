import type { Server } from "socket.io";
import type { Game, Player } from "$lib/game-logic/types";
import storage from "$lib/services/redis";
import log from "$lib/log";
import {
  playerFromToken,
  playerOffline,
  playerOnline,
} from "$lib/game-logic/player-fns";
import { updatePlayer } from "$lib/game-logic/game-fns";

export function allGames(): Promise<Game[]> {
  return storage.all<Game>("games/*");
}

/**
 * Returns the game and notify function to broadcast the changes to all players
 */
export async function getGameById(id: string): Promise<Game> {
  const game = await storage.get<Game>(`games/${id}`);
  if (!game) {
    throw new Error(`Game "${id}"" not found`);
  }
  return game;
}
const HOUR = 60 * 60;
export async function publishGame(game: Game): Promise<void> {
  await storage.set(`games/${game.id}`, game, { ttl: 2 * HOUR });
}

/**
 * Multiplayer Server
 */
export default function multiplayer(io: Server): void {
  storage.subscribe(
    "games/*",
    (game: Game) => {
      io.to(`games/${game.id}`).emit(`games/${game.id}`, game);
    },
    (err) => {
      log.error("storage.subscribe()", err);
    }
  );
  io.on("connection", (socket) => {
    let player: Player | undefined;
    if (socket.handshake.auth.token) {
      player = playerFromToken(socket.handshake.auth.token);
      log(`${player.name} online`);
      socket.on("disconnect", () => {
        log(player?.name, "offline");
      });
    } else {
      log("non authenticated connection");
    }
    try {
      socket.on("join", async (id: string) => {
        if (!player) {
          throw new Error("Anonymous connection can't join");
        }
        const room = `games/${id}`;
        await socket.join(room);
        const game = await getGameById(id);
        if (!game) {
          throw new Error(`Can't join ${id}, game not found`);
        }
        let leave = (leaveGame: Game, leavePlayer: Player) => {
          socket.leave(room);
          publishGame(
            updatePlayer(leaveGame, playerOffline(leavePlayer))
          ).catch((err) => log.error("publishGame():", err));
          log(leavePlayer.name, "left", id);
          leave = () => {};
        };
        socket.on("leave", async (leaveId) => {
          leave(await getGameById(leaveId), player as Player);
        });
        if (!socket.disconnected) {
          publishGame(updatePlayer(game, playerOnline(player))).catch((err) =>
            log.error("publishGame():", err)
          );
          log(player.name, "joined", id);
          socket.once("disconnect", async () => {
            leave(await getGameById(id), player as Player);
          });
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      socket.disconnect();
    }
  });
}
