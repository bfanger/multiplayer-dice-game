/* eslint-disable import/prefer-default-export */
import type { EndpointOutput, Request } from "@sveltejs/kit";
import { createGame, joinGame } from "$lib/game-logic/game-fns";
import { playerFromToken } from "$lib/game-logic/player-fns";
import { allGames, publishGame } from "$lib/server/multiplayer";
import type { Player } from "$lib/game-logic/types";

export type GameListing = {
  id: string;
  players: Player[];
  started: boolean;
};
export async function get(): Promise<EndpointOutput<GameListing[]>> {
  const games = await allGames();
  const active = games.filter(
    (game) =>
      game.phase !== "GAME-OVER" &&
      game.players.some((player) => player.connected)
  );
  return {
    body: active.map((game) => ({
      id: game.id,
      started: game.turn === undefined,
      players: game.players,
    })),
  };
}

export function post(req: Request): EndpointOutput<{ id: string }> {
  if (!req.headers.authorization) {
    throw new Error("Missing Authorization header");
  }
  const jwt = req.headers.authorization.replace(/^Bearer /i, "");
  const player = playerFromToken(jwt);
  const game = joinGame(createGame(), player);
  publishGame(game);
  return {
    body: { id: game.id },
  };
}
