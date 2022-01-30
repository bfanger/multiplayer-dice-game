import type { RequestHandler } from "@sveltejs/kit";
import { playerForRequestEvent } from "$lib/server/server-fns";

export const get: RequestHandler = (e) => {
  const player = playerForRequestEvent(e);
  return {
    body: player,
  };
};
