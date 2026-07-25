import pino from "pino";
import type { LokiOptions } from "pino-loki";
import env from "./env";

const transport = env.LOKI_URL
  ? pino.transport<LokiOptions>({
      target: "pino-loki",
      options: {
        host: env.LOKI_URL,
        labels: {
          service: "dice-game",
        },
      },
    })
  : undefined;

const log = pino(transport);

export default log;
