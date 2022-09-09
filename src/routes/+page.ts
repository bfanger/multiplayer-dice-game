import client from "$lib/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const player =
    typeof window === "undefined"
      ? undefined
      : await client.me(fetch).catch(() => undefined);
  return { player };
};
