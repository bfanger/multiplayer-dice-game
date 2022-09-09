import { json } from "@sveltejs/kit";
import { createGame, joinGame } from "$lib/game-logic/game-fns";
import { allGames, publishGame } from "$lib/server/multiplayer";
import type { Player } from "$lib/game-logic/types";
import { playerForRequestEvent } from "$lib/server/server-fns";
import type { RequestHandler } from "./$types";

export type GameListing = {
  id: string;
  players: Player[];
  started: boolean;
};
export const GET: RequestHandler = async () => {
  const games = await allGames();
  const active = games.filter(
    (game) =>
      game.phase !== "GAME-OVER" &&
      game.players.some((player) => player.connected)
  );

  return json(
    active.map((game) => ({
      id: game.id,
      started: game.turn === undefined,
      players: game.players,
    }))
  );
};

export const POST: RequestHandler = (e) => {
  const player = playerForRequestEvent(e);
  const game = joinGame(createGame(), player);
  publishGame(game);
  return json({ id: game.id });
};
