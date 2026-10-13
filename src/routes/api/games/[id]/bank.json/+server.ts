import type { RequestHandler } from "@sveltejs/kit";
import { publishGame } from "#lib/server/multiplayer.js";
import { bankValueInGame } from "#lib/game-logic/game-fns.js";
import {
  emptyResponse,
  myTurnForRequestEvent,
} from "#lib/server/server-fns.js";
import redis from "#lib/services/redis.js";

export const POST: RequestHandler = async (e) => {
  const { value } = await e.request.json();
  if (typeof value !== "number") {
    return Response.json(
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
