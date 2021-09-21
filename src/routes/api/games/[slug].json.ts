/* eslint-disable import/prefer-default-export */
import type { EndpointOutput } from "@sveltejs/kit";
import { games } from "$lib/server/multiplayer";

export function get({
  params,
}: {
  params: { slug: string };
}): EndpointOutput<any> {
  const game = games[params.slug];
  return {
    body: game,
  };
}
