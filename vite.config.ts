import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vitest/config";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

const config: UserConfig = {
  plugins: [
    sveltekit(),
    {
      name: "multiplayer",
      configureServer(server) {
        import("./dist/multiplayer.js").then(({ default: multiplayer }) => {
          multiplayer(new Server(server.httpServer as HttpServer));
        });
      },
    },
  ],
  test: {
    globals: true,
    environment: "happy-dom",
  },
};

export default config;
