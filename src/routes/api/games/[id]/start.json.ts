/* eslint-disable import/prefer-default-export */
import type { EndpointOutput } from "@sveltejs/kit";
import { getGameById, publishGame } from "$lib/server/multiplayer";
import { startGame } from "$lib/game-logic/game-fns";

export async function post({
  params,
}: {
  params: { id: string };
}): Promise<EndpointOutput<string>> {
  const game = await getGameById(params.id);
  publishGame(startGame(game));
  return {
    headers: { "Content-Type": "application/json" },
    body: "null",
  };
}
