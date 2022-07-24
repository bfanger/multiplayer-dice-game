import type { RequestHandler } from "@sveltejs/kit";
import { publishGame } from "$lib/server/multiplayer";
import { stealChip } from "$lib/game-logic/game-fns";
import { emptyResponse, myTurnForRequestEvent } from "$lib/server/server-fns";

export const POST: RequestHandler = async (e) => {
  const { chipIndex } = await e.request.json();
  if (typeof chipIndex !== "number") {
    return {
      status: 400,
      body: { error: "Missing required value" },
    };
  }
  const game = await myTurnForRequestEvent(e);
  publishGame(stealChip(game, chipIndex));
  return emptyResponse();
};
