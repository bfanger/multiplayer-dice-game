import { json, type RequestHandler } from "@sveltejs/kit";
import sign from "jwt-encode";
import { createHash } from "crypto";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string(),
  email: z.string(),
});

export const POST: RequestHandler = async ({ request }) => {
  const { name, email } = signupSchema.parse(await request.json());
  const data = {
    sub: "player",
    iat: Math.round(Date.now() / 1000),
    oid: createHash("sha1")
      .update(Date.now() + name + email)
      .digest()
      .toString(),
    unique_name: email || `user_${Date.now()}`,
    name,
  };
  return json({ token: sign(data, "signup") });
};
