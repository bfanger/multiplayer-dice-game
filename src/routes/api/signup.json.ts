import type { RequestHandler } from "@sveltejs/kit";
import sign from "jwt-encode";
import { createHash } from "crypto";

export const POST: RequestHandler = async ({ request }) => {
  const { name, email } = await request.json();
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
  return {
    body: { token: sign(data, "signup") },
  };
};
