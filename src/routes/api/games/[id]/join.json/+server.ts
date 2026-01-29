import type { RequestHandler } from "@sveltejs/kit";
import { joinGame } from "$lib/game-logic/game-fns";
import { publishGame } from "$lib/server/multiplayer";
import {
  emptyResponse,
  gameForRequestEvent,
  playerForRequestEvent,
} from "$lib/server/server-fns";

export const POST: RequestHandler = async (e) => {
  const player = playerForRequestEvent(e);
  const game = await gameForRequestEvent(e);
  void publishGame(joinGame(game, player));
  return emptyResponse();
};
