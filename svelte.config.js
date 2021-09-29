/* eslint-disable import/no-extraneous-dependencies */
import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";
import { Server } from "socket.io";
import { config } from "dotenv";

config();

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
          configureServer(server) {
            import("./dist/multiplayer.js").then(({ default: multiplayer }) => {
              multiplayer(new Server(server.httpServer));
            });
          },
        },
      ],
    },
  },
};
