import redis from "$lib/services/redis";

const metrics = {
  signups_total: "Total number of player sign-ups",
  started_total: "Total number of games started",
  throws_total: "Total number of times the dice where thrown",
  banked_total: "Total number of times a value was banked. dice(s) selected",
  busts_total: "Total number of time the throw resulted in busted hand",
  steals_total: "Total number of steals from other players",
  claims_total: "Total number of claims of a chip ",
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
    values.busts_total + values.steals_total + values.claims_total
  }\n\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
