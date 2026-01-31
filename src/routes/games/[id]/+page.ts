import api from "$lib/services/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  const game = await api.get("games/[id].json", {
    params: { id: params.id },
    fetch,
  });
  return {
    game,
  };
};
