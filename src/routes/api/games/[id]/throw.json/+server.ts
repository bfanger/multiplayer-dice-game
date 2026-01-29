import type { RequestHandler } from "@sveltejs/kit";
import { publishGame } from "$lib/server/multiplayer";
import { throwDiceInGame } from "$lib/game-logic/game-fns";
import { emptyResponse, myTurnForRequestEvent } from "$lib/server/server-fns";

export const POST: RequestHandler = async (e) => {
  const game = await myTurnForRequestEvent(e);
  void publishGame(throwDiceInGame(game));
  return emptyResponse();
};
