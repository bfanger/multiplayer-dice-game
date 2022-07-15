import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vitest/config";
import { Server } from "socket.io";
// import { config } from "dotenv";

// config();

const config: UserConfig = {
  plugins: [
    sveltekit(),
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
  test: {
    globals: true,
    environment: "happy-dom",
  },
  // vite: {
  //   plugins: [

  //   ],
  // },
};

export default config;
