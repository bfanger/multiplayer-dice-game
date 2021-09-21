/* eslint-disable import/prefer-default-export */
import type { EndpointOutput } from "@sveltejs/kit";
import { joinGame } from "$lib/game-logic/game-fns";
import { fakePlayer } from "$lib/game-logic/player-fns";
import { games } from "$lib/server/multiplayer";

export function get({
  params,
}: {
  params: { slug: string };
}): EndpointOutput<any> {
  const game = games[params.slug];
  const player = fakePlayer();
  joinGame(game, player);
  return {
    body: { ok: true },
  };
}
