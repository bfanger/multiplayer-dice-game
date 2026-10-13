import type { RequestHandler } from "@sveltejs/kit";
import {
  emptyResponse,
  gameForRequestEvent,
  playerForRequestEvent,
} from "#lib/server/server-fns.js";
import { hasHostAccess, startGame } from "#lib/game-logic/game-fns.js";
import { publishGame } from "#lib/server/multiplayer.js";
import redis from "#lib/services/redis.js";

export const POST: RequestHandler = async (e) => {
  const player = playerForRequestEvent(e);
  const game = await gameForRequestEvent(e);
  if (hasHostAccess(game, player) === false) {
    throw new Error("Only the host can start the game");
  }
  void redis.increment("started_total");
  void publishGame(startGame(game));
  return emptyResponse();
};
