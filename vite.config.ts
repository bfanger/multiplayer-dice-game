import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      name: "multiplayer",
      configureServer(server) {
        void import("./dist/multiplayer.js").then(
          ({ default: multiplayer }) => {
            multiplayer(new Server(server.httpServer as HttpServer));
          },
        );
      },
    },
  ],
  test: {
    globals: true,
    environment: "happy-dom",
  },
});
