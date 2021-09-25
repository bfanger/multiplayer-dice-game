import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });
client.connect();
const pubSubClient = createClient({ url: process.env.REDIS_URL });
pubSubClient.connect();

async function get<T extends unknown>(key: string): Promise<T | undefined>;
async function get<T extends unknown>(key: string, fallback: T): Promise<T>;
async function get<T extends unknown>(
  key: string,
  fallback?: T
): Promise<T | undefined> {
  const value = await client.get(key);
  if (value === null) {
    return fallback;
  }
  return JSON.parse(value);
}
async function set(
  key: string,
  value: unknown,
  options?: { ttl: number } // TTL in seconds
): Promise<void> {
  const data = JSON.stringify(value);
  const config = options ? { EX: options.ttl } : {};
  await client.set(key, data, config);
  client.publish(key, data);
}
async function all<T>(query: string): Promise<T[]> {
  const keys = await client.keys(query);
  const values = await Promise.all(keys.map((key) => get<T>(key)));
  return values.filter((value) => typeof value !== "undefined") as T[];
}
function subscribe<T>(
  channel: string,
  listener: (value: T) => void
): () => void {
  const wrapped = (data: string) => {
    listener(JSON.parse(data));
  };
  if (channel.endsWith("*")) {
    pubSubClient.pSubscribe(channel, wrapped);
    return function unsubscribe() {
      pubSubClient.pUnsubscribe(channel, wrapped);
    };
  }
  pubSubClient.subscribe(channel, wrapped);
  return function unsubscribe() {
    pubSubClient.unsubscribe(channel, wrapped);
  };
}
const storage = {
  get,
  set,
  all,
  subscribe,
};
export default storage;
