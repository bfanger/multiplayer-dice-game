/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { joinGame } from "$lib/game-logic/game-fns";
import { playerFromToken } from "$lib/game-logic/player-fns";
import { getGameById, publishGame } from "$lib/server/multiplayer";

export async function get(req: Request): Promise<EndpointOutput<any>> {
  if (!req.headers.authorization) {
    throw new Error("Missing Authorization header");
  }
  const jwt = req.headers.authorization.replace(/^Bearer /i, "");
  const player = playerFromToken(jwt);
  const game = await getGameById(req.params.id);
  publishGame(joinGame(game, player));
  return {
    body: { ok: true },
  };
}
