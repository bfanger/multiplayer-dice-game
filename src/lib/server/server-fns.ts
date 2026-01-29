import { json, type RequestEvent } from "@sveltejs/kit";
import type { Game, Player } from "$lib/game-logic/types";
import { playerFromToken } from "$lib/game-logic/player-fns";

import { getGameById } from "./multiplayer";

export function emptyResponse(): Response {
  return json(null);
}
export function playerForRequestEvent({ request }: RequestEvent): Player {
  const auth = request.headers.get("authorization");
  if (!auth) {
    throw new Error("Missing Authorization header");
  }
  const jwt = auth.replace(/^Bearer /i, "");
  return playerFromToken(jwt);
}
export function gameForRequestEvent({ params }: RequestEvent): Promise<Game> {
  if (!params.id) {
    throw new Error("Missing game ID");
  }
  return getGameById(params.id);
}
export async function myTurnForRequestEvent(
  request: RequestEvent,
): Promise<Game> {
  const player = playerForRequestEvent(request);
  const game = await gameForRequestEvent(request);
  if (player.id !== game.turn) {
    throw new Error("Not your turn");
  }
  return game;
}
