import api from "$lib/services/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const game = await api.get("games/[id].json", {
      params: { id: params.id },
      fetch,
    });

    return { game };
  } catch (err) {
    console.warn(err);
    return { game: undefined };
  }
};
