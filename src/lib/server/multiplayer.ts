import type { Server } from "socket.io";
import type { Game, Player } from "$lib/game-logic/types";
import redis from "$lib/services/redis";
import log from "$lib/log";
import {
  playerFromToken,
  playerOffline,
  playerOnline,
} from "$lib/game-logic/player-fns";
import { updatePlayer } from "$lib/game-logic/game-fns";

export function allGames(): Promise<Game[]> {
  return redis.all<Game>("games/*");
}

/**
 * Returns the game and notify function to broadcast the changes to all players
 */
export async function getGameById(id: string): Promise<Game> {
  const game = await redis.get<Game>(`games/${id}`);
  if (!game) {
    throw new Error(`Game "${id}"" not found`);
  }
  return game;
}
const HOUR = 60 * 60;
export async function publishGame(game: Game): Promise<void> {
  await redis.set(`games/${game.id}`, game, { ttl: 2 * HOUR });
}

/**
 * Multiplayer Server
 */
export default function multiplayer(io: Server): void {
  redis.subscribe(
    "games/*",
    (game: Game) => {
      io.to(`games/${game.id}`).emit(`games/${game.id}`, game);
    },
    (err) => {
      log.error("storage.subscribe()", err);
    },
  );
  io.on("connection", (socket) => {
    let player: Player | undefined;
    if (socket.handshake.auth.token) {
      player = playerFromToken(socket.handshake.auth.token as string);
      log(`${player.name} online`);
      socket.on("disconnect", () => {
        log(player?.name, "offline");
      });
    }
    socket.on("join", async (id: string) => {
      try {
        const room = `games/${id}`;
        await socket.join(room);
        if (!player) {
          log(`Spectator watching ${id}`);
        } else {
          const game = await getGameById(id);
          if (!game) {
            throw new Error(`Can't join ${id}, game not found`);
          }
          let leave = (leaveGame: Game, leavePlayer: Player) => {
            void socket.leave(room);
            void publishGame(
              updatePlayer(leaveGame, playerOffline(leavePlayer)),
            ).catch((err) => log.error("publishGame():", err));
            log(leavePlayer.name, "left", id);
            leave = () => undefined;
          };
          socket.on("leave", async (leaveId) => {
            leave(await getGameById(leaveId as string), player);
          });
          if (!socket.disconnected) {
            publishGame(updatePlayer(game, playerOnline(player))).catch((err) =>
              log.error("publishGame():", err),
            );
            log(player.name, "joined", id);
            socket.once("disconnect", async () => {
              leave(await getGameById(id), player);
            });
          }
        }
      } catch (err) {
        console.warn(err);
        socket.disconnect();
      }
    });
  });
}
