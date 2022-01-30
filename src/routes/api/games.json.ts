import type { RequestHandler } from "@sveltejs/kit";
import { createGame, joinGame } from "$lib/game-logic/game-fns";
import { allGames, publishGame } from "$lib/server/multiplayer";
import type { Player } from "$lib/game-logic/types";
import { playerForRequestEvent } from "$lib/server/server-fns";

export type GameListing = {
  id: string;
  players: Player[];
  started: boolean;
};
export const get: RequestHandler = async () => {
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
};

export const post: RequestHandler = (e) => {
  const player = playerForRequestEvent(e);
  const game = joinGame(createGame(), player);
  publishGame(game);
  return {
    body: { id: game.id },
  };
};
