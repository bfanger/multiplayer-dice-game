import type { RequestHandler } from "@sveltejs/kit";
import { publishGame } from "$lib/server/multiplayer";
import { bankValueInGame } from "$lib/game-logic/game-fns";
import { emptyResponse, myTurnForRequestEvent } from "$lib/server/server-fns";

export const post: RequestHandler = async (e) => {
  const { value } = await e.request.json();
  if (typeof value !== "number") {
    return {
      status: 400,
      body: { error: "Missing required value" },
    };
  }
  const game = await myTurnForRequestEvent(e);
  publishGame(bankValueInGame(game, value));
  return emptyResponse();
};
