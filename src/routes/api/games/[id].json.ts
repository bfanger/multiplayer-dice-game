import type { RequestHandler } from "@sveltejs/kit";
import { getGameById } from "$lib/server/multiplayer";

export const GET: RequestHandler = async ({ params }) => {
  return {
    body: await getGameById(params.id),
  };
};
