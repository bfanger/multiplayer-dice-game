import adapter from "@sveltejs/adapter-node";
import runesMode from "./src/runesMode.js";

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: runesMode(),
  kit: {
    adapter: adapter({ precompress: true }),
    experimental: { remoteFunctions: true },
  },
};
