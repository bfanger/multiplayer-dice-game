/* eslint-disable import/prefer-default-export */
import type { EndpointOutput } from "@sveltejs/kit";
import { hostFromGame } from "$lib/game-logic/game-fns";
import type { Game } from "$lib/game-logic/types";
import { games } from "$lib/server/multiplayer";

export function listGames(): Game[] {
  return Object.values<Game>(games).filter(
    (game) =>
      typeof game.turn === "undefined" &&
      typeof hostFromGame(game).disconnected === "undefined"
  );
}

export function get(): EndpointOutput<any> {
  return {
    body: listGames().map((game) => ({
      id: game.id,
      host: hostFromGame(game).name,
      players: game.players.length,
    })),
  };
}
