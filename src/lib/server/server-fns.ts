import type { RequestHandlerOutput } from "@sveltejs/kit";
import type { Game, Player } from "$lib/game-logic/types";
import { playerFromToken } from "$lib/game-logic/player-fns";
import type { RequestEvent } from "@sveltejs/kit/types/internal";
import { getGameById } from "./multiplayer";

export function emptyResponse(): RequestHandlerOutput<string> {
  return {
    headers: { "Content-Type": "application/json" },
    body: "null",
  };
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
  return getGameById(params.id);
}
export async function myTurnForRequestEvent(
  request: RequestEvent
): Promise<Game> {
  const player = playerForRequestEvent(request);
  const game = await gameForRequestEvent(request);
  if (player.id !== game.turn) {
    throw new Error("Not your turn");
  }
  return game;
}
