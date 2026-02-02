import { error, json } from "@sveltejs/kit";
import { getGameById } from "$lib/server/multiplayer";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  try {
    return json(await getGameById(params.id));
  } catch (err) {
    console.warn(err);
    return error(404);
  }
};
