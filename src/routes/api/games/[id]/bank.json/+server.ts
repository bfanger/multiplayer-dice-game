import { json as json$1 } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { publishGame } from "$lib/server/multiplayer";
import { bankValueInGame } from "$lib/game-logic/game-fns";
import { emptyResponse, myTurnForRequestEvent } from "$lib/server/server-fns";
import redis from "$lib/services/redis";

export const POST: RequestHandler = async (e) => {
  const { value } = await e.request.json();
  if (typeof value !== "number") {
    return json$1(
      { error: "Missing required value" },
      {
        status: 400,
      },
    );
  }
  const game = await myTurnForRequestEvent(e);
  void publishGame(bankValueInGame(game, value));
  void redis.increment("banked_total");
  return emptyResponse();
};
