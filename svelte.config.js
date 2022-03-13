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
    adapter: adapter(),
    vite: {
      plugins: [
        {
          name: "multiplayer",
          configureServer(server) {
            // eslint-disable-next-line import/extensions
            import("./dist/multiplayer.js").then(({ default: multiplayer }) => {
              multiplayer(new Server(server.httpServer));
            });
          },
        },
      ],
    },
  },
};
