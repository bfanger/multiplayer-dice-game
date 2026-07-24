import redis from "$lib/services/redis";

const metrics = {
  throws_total: "Total number of dice throws",
  turn_bust_total: "Total number of busted turns",
  banked_total: "Total number of times points were banked",
  steals_total: "Total number of successful steals",
  started_total: "Total number of games started",
  signups_total: "Total number of player signups",
};
type Metric = keyof typeof metrics;
const keys = Object.keys(metrics) as any as Metric[];

export async function GET() {
  const values = Object.fromEntries(
    await Promise.all(
      keys.map(async (key) => [key, (await redis.get(key)) ?? 0]),
    ),
  );

  let body = "";
  for (const key of keys) {
    const name = `game_${key}`;
    body += `# HELP ${key} ${metrics[key]}\n# TYPE ${name} counter\n${name} ${values[key]}\n\n`;
  }
  body += `# HELP Total number of turns\n# TYPE game_turns_total counter\ngame_turns_total ${
    values.turn_bust_total + values.banked_total + values.steals_total
  }\n\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
