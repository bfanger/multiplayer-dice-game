import type { EndpointOutput, Request } from "@sveltejs/kit";
import type { Game, Player } from "$lib/game-logic/types";
import { playerFromToken } from "$lib/game-logic/player-fns";
import { getGameById } from "./multiplayer";

export function emptyResponse(): EndpointOutput<string> {
  return {
    headers: { "Content-Type": "application/json" },
    body: "null",
  };
}
export function playerForRequest({ headers }: Request): Player {
  if (!headers.authorization) {
    throw new Error("Missing Authorization header");
  }
  const jwt = headers.authorization.replace(/^Bearer /i, "");
  return playerFromToken(jwt);
}
export function gameForRequest({ params }: Request): Promise<Game> {
  return getGameById(params.id);
}
export async function myTurnForRequest(request: Request): Promise<Game> {
  const player = playerForRequest(request);
  const game = await gameForRequest(request);
  if (player.id !== game.turn) {
    throw new Error("Not your turn");
  }
  return game;
}
