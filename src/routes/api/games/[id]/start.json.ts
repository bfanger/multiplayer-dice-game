/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import {
  emptyResponse,
  gameForRequest,
  playerForRequest,
} from "$lib/server/server-fns";
import { hasHostAccess, startGame } from "$lib/game-logic/game-fns";
import { publishGame } from "$lib/server/multiplayer";

export async function post(request: Request): Promise<EndpointOutput<string>> {
  const player = playerForRequest(request);
  const game = await gameForRequest(request);
  if (hasHostAccess(game, player) === false) {
    throw new Error("Only the host can start the game");
  }
  publishGame(startGame(game));
  return emptyResponse();
}
