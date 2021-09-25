/* eslint-disable import/no-extraneous-dependencies */
import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";
import { Server } from "socket.io";
import { multiplayer } from "./dist/multiplayer.cjs";

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: preprocess(),
  kit: {
    target: "svelte-app",
    adapter: adapter(),
    vite: {
      envPrefix: "REDIS_",
      plugins: [
        {
          name: "multiplayer",
          // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
          configureServer(server) {
            multiplayer(new Server(server.httpServer));
          },
        },
      ],
    },
  },
};
