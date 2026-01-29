function prefix() {
  const date = new Date();
  function part(method: "getHours" | "getMinutes" | "getSeconds") {
    return date[method]().toString().padStart(2, "0");
  }
  return `[${part("getHours")}:${part("getMinutes")}:${part("getSeconds")}]`;
}
export default function log(...args: unknown[]): void {
  console.info(prefix(), ...args);
}
log.error = (...args: unknown[]): void => {
  console.error(prefix(), ...args);
};
