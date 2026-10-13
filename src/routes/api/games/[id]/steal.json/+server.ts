import type { RequestHandler } from "@sveltejs/kit";
import { publishGame } from "#lib/server/multiplayer.js";
import { stealChip } from "#lib/game-logic/game-fns.js";
import {
  emptyResponse,
  myTurnForRequestEvent,
} from "#lib/server/server-fns.js";
import redis from "#lib/services/redis.js";

export const POST: RequestHandler = async (e) => {
  const { chipIndex } = await e.request.json();
  if (typeof chipIndex !== "number") {
    return Response.json(
      { error: "Missing required value" },
      {
        status: 400,
      },
    );
  }
  const game = await myTurnForRequestEvent(e);
  const stole = game.chips[chipIndex]?.playerId;
  void publishGame(stealChip(game, chipIndex));
  if (stole) {
    void redis.increment("steals_total");
  } else {
    void redis.increment("claims_total");
  }
  return emptyResponse();
};
