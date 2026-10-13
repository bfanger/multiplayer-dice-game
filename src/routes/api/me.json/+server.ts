import type { RequestHandler } from "@sveltejs/kit";
import { playerForRequestEvent } from "#lib/server/server-fns.js";

export const GET: RequestHandler = (e) => {
  const player = playerForRequestEvent(e);
  return Response.json(player);
};
