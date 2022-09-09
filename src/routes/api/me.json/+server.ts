import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { playerForRequestEvent } from "$lib/server/server-fns";

export const GET: RequestHandler = (e) => {
  const player = playerForRequestEvent(e);
  // Suggestion (check for correctness before using):
  // return json(player);
  return json(player);
};
