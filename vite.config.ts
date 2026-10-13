import adapter from "@sveltejs/adapter-node";
import runesMode from "./src/runesMode.js";
import { varlockVitePlugin } from "@varlock/vite-integration";
import { sveltekit } from "@sveltejs/kit/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig, type Plugin } from "vitest/config";
import { FontaineTransform } from "fontaine";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  plugins: [
    (varlockVitePlugin({ ssrInjectMode: "resolved-env" }) as Plugin[]).map(
      (p) => {
        delete p.transformIndexHtml;
        return p;
      },
    ),
    devtoolsJson(),
    sveltekit({
      preprocess: runesMode(),
      adapter: adapter({ precompress: true }),
      experimental: { remoteFunctions: true },
    }),
    FontaineTransform.vite({
      fallbacks: { "Poetsen One": ["Arial", "sans-serif"] },
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
