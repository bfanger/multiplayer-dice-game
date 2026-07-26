let ping = false;

export function GET() {
  ping = !ping;
  return new Response(ping ? "ping" : "PONG", {
    status: 201,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
