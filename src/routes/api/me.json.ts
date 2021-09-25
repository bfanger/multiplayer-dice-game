/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { playerFromToken } from "$lib/game-logic/player-fns";

export function get(req: Request): EndpointOutput<{ id: string }> {
  if (!req.headers.authorization) {
    throw new Error("Missing Authorization header");
  }
  const jwt = req.headers.authorization.replace(/^Bearer /i, "");
  return {
    body: playerFromToken(jwt),
  };
}
