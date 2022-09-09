import { json } from "@sveltejs/kit";
import { getGameById } from "$lib/server/multiplayer";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  // Suggestion (check for correctness before using):
  // return new Response(await getGameById(params.id));
  return json(await getGameById(params.id));
};
