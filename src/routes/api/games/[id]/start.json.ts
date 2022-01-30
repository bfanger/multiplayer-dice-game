import type { RequestHandler } from "@sveltejs/kit";
import {
  emptyResponse,
  gameForRequestEvent,
  playerForRequestEvent,
} from "$lib/server/server-fns";
import { hasHostAccess, startGame } from "$lib/game-logic/game-fns";
import { publishGame } from "$lib/server/multiplayer";

export const post: RequestHandler = async (e) => {
  const player = playerForRequestEvent(e);
  const game = await gameForRequestEvent(e);
  if (hasHostAccess(game, player) === false) {
    throw new Error("Only the host can start the game");
  }
  publishGame(startGame(game));
  return emptyResponse();
};
