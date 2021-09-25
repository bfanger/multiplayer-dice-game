/* eslint-disable import/prefer-default-export */
import type { EndpointOutput } from "@sveltejs/kit";
import { getGameById } from "$lib/server/multiplayer";
import type { Game } from "$lib/game-logic/types";

export async function get({
  params,
}: {
  params: { id: string };
}): Promise<EndpointOutput<Game>> {
  return {
    body: await getGameById(params.id),
  };
}
