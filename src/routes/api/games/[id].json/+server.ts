import { error } from "@sveltejs/kit";
import { getGameById } from "#lib/server/multiplayer.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  try {
    return Response.json(await getGameById(params.id));
  } catch (err) {
    console.warn(err);
    return error(404);
  }
};
