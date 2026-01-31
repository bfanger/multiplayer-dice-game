import { json } from "@sveltejs/kit";
import { getGameById } from "$lib/server/multiplayer";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  return json(await getGameById(params.id));
};
