/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { hostFromGame, createGame } from "$lib/game-logic/game-fns";
import { playerFromToken } from "$lib/game-logic/player-fns";
import { allGames, publishGame } from "$lib/server/multiplayer";

export type GameListing = {
  id: string;
  host: string;
  playerCount: number;
  started: boolean;
};
export async function get(): Promise<EndpointOutput<GameListing[]>> {
  const games = await allGames();
  const active = games.filter((game) => hostFromGame(game).connected);
  return {
    body: active.map((game) => ({
      id: game.id,
      host: hostFromGame(game).name,
      playerCount: game.players.length,
      started: game.turn === undefined,
    })),
  };
}

export function post(req: Request): EndpointOutput<{ id: string }> {
  if (!req.headers.authorization) {
    throw new Error("Missing Authorization header");
  }
  const jwt = req.headers.authorization.replace(/^Bearer /i, "");
  const host = playerFromToken(jwt);
  const game = createGame(host);
  publishGame(game);
  return {
    body: { id: game.id },
  };
}
