/* eslint-disable import/prefer-default-export */
import type { EndpointOutput } from "@sveltejs/kit";
import { fakePlayer } from "$lib/game-logic/player-fns";
import { createGame } from "$lib/game-logic/game-fns";
import { games } from "$lib/server/multiplayer";

export function get(): EndpointOutput<{ id: string }> {
  const host = fakePlayer();
  const game = createGame(host);
  games[game.id] = game;
  return {
    body: { id: game.id },
  };
}
