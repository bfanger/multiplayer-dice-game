/* eslint-disable import/no-extraneous-dependencies */
import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
  },
};
