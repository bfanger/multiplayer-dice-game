// eslint-disable-next-line import/no-mutable-exports
let env: Record<string, string | undefined> = {};
if (typeof process === "object" && typeof process.env === "object") {
  env = process.env;
} else if (typeof document !== "undefined") {
  const el = document.querySelector('script[type="svelte/env"]');
  if (el) {
    env = JSON.parse(el.textContent as string);
  }
}
export default env;
