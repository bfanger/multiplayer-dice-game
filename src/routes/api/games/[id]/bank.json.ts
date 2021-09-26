/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { publishGame } from "$lib/server/multiplayer";
import { bankValueInGame } from "$lib/game-logic/game-fns";
import { emptyResponse, myTurnForRequest } from "$lib/server/server-fns";

export async function post(request: Request): Promise<EndpointOutput<any>> {
  const { value } = request.body as any;
  if (typeof value !== "number") {
    return {
      status: 400,
      body: { error: "Missing required value" },
    };
  }
  const game = await myTurnForRequest(request);
  publishGame(bankValueInGame(game, value));
  return emptyResponse();
}
