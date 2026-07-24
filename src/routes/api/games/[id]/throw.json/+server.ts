import type { RequestHandler } from "@sveltejs/kit";
import { publishGame } from "$lib/server/multiplayer";
import { throwDiceInGame } from "$lib/game-logic/game-fns";
import { emptyResponse, myTurnForRequestEvent } from "$lib/server/server-fns";
import redis from "$lib/services/redis";

export const POST: RequestHandler = async (e) => {
  const game = await myTurnForRequestEvent(e);
  const after = throwDiceInGame(game);
  void publishGame(after);
  void redis.increment("throws_total");
  if (["GAME-OVER", "NEW-TURN-BUST"].includes(after.phase)) {
    void redis.increment("turn_bust_total");
  }
  return emptyResponse();
};
