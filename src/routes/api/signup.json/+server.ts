import { json, type RequestHandler } from "@sveltejs/kit";
import sign from "jwt-encode";
import { createHash } from "crypto";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().max(20),
});

export const POST: RequestHandler = async ({ request }) => {
  const { name } = signupSchema.parse(await request.json());
  const data = {
    sub: "player",
    iat: Math.round(Date.now() / 1000),
    oid: createHash("sha1")
      .update(Date.now() + name)
      .digest("hex"),
    unique_name: `user_${Date.now()}`,
    name,
  };
  return json({ token: sign(data, "signup") });
};
