export default function log(...args: unknown[]): void {
  const date = new Date();
  function part(method: "getHours" | "getMinutes" | "getSeconds") {
    return date[method]().toString().padStart(2, "0");
  }
  // eslint-disable-next-line no-console
  console.info(
    `[${part("getHours")}:${part("getMinutes")}:${part("getSeconds")}]`,
    ...args
  );
}
