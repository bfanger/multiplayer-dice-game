/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { joinGame } from "$lib/game-logic/game-fns";
import { publishGame } from "$lib/server/multiplayer";
import {
  emptyResponse,
  gameForRequest,
  playerForRequest,
} from "$lib/server/server-fns";

export async function post(request: Request): Promise<EndpointOutput<string>> {
  const player = playerForRequest(request);
  const game = await gameForRequest(request);
  publishGame(joinGame(game, player));
  return emptyResponse();
}
