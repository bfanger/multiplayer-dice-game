import { createClient } from "redis";
import { spawn } from "node:child_process";

async function isRedisRunning(): Promise<boolean> {
  try {
    const client = createClient({ url: "redis://localhost:6379" });
    await client.connect();
    await client.ping();
    await client.quit();
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (await isRedisRunning()) {
    process.stderr.write("Redis already running");
    process.exit(0);
  }

  const server = spawn("redis-server", { stdio: "inherit" });

  server.on("error", (err) => {
    console.error("Failed to start redis-server:", err.message);
    process.exit(1);
  });

  server.on("exit", (code, signal) => {
    console.info(`redis-server exited with code ${code}, signal ${signal}`);
    process.exit(code ?? 0);
  });
}

await main();
