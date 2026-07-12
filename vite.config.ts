import { varlockVitePlugin } from "@varlock/vite-integration";
import { sveltekit } from "@sveltejs/kit/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vitest/config";
import { FontaineTransform } from "fontaine";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    varlockVitePlugin(),
    devtoolsJson(),
    sveltekit(),
    FontaineTransform.vite({
      fallbacks: {
        "Poetsen One": ["Arial", "sans-serif"],
      },
    }),
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
