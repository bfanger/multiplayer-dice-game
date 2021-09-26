/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { publishGame } from "$lib/server/multiplayer";
import { throwDiceInGame } from "$lib/game-logic/game-fns";
import { emptyResponse, myTurnForRequest } from "$lib/server/server-fns";

export async function post(req: Request): Promise<EndpointOutput<string>> {
  const game = await myTurnForRequest(req);
  publishGame(throwDiceInGame(game));
  return emptyResponse();
}
