/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { getGameById, publishGame } from "$lib/server/multiplayer";
import { throwDice } from "$lib/game-logic/game-fns";
import { playerFromToken } from "$lib/game-logic/player-fns";

export async function post(req: Request): Promise<EndpointOutput<string>> {
  if (!req.headers.authorization) {
    throw new Error("Missing Authorization header");
  }
  const jwt = req.headers.authorization.replace(/^Bearer /i, "");
  const player = playerFromToken(jwt);
  const game = await getGameById(req.params.id);
  publishGame(throwDice(game, player));
  return {
    headers: { "Content-Type": "application/json" },
    body: "null",
  };
}
