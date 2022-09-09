import { readable } from "svelte/store";
import api from "$lib/services/api";
import client from "$lib/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  const player = await client.me(fetch).catch(() => undefined);
  const $game = await api.get("games/[id].json", {
    params: { id: params.id },
    fetch,
  });
  return {
    game: readable($game),
    player,
  };
};
