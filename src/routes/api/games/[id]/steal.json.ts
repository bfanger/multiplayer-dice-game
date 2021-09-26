/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { publishGame } from "$lib/server/multiplayer";
import { stealChip } from "$lib/game-logic/game-fns";
import { emptyResponse, myTurnForRequest } from "$lib/server/server-fns";

export async function post(request: Request): Promise<EndpointOutput<any>> {
  const { chipIndex } = request.body as any;
  if (typeof chipIndex !== "number") {
    return {
      status: 400,
      body: { error: "Missing required value" },
    };
  }
  const game = await myTurnForRequest(request);
  publishGame(stealChip(game, chipIndex));
  return emptyResponse();
}
