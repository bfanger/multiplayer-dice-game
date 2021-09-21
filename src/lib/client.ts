import type { Socket } from "socket.io";
import { derived, writable } from "svelte/store";
import type { Player } from "./game-logic/types";
import { accessToken } from "./stores/auth";

let ready: Promise<void> | undefined;
export default async function injectSocketIO(): Promise<any> {
  if (typeof ready === "undefined") {
    ready = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.onload = () => resolve();
      s.onerror = reject;
      s.onabort = reject;
      s.src = "/socket.io/socket.io.js";
      document.head.appendChild(s);
    });
  }
  await ready;
  if (typeof window === "undefined") {
    throw new Error("socket.io client is not available in SSR");
  }
  const win = window as unknown as { io: () => Socket };
  return win.io;
}
export const player = writable<Player | undefined>();
export const socket = derived(accessToken, ($accessToken, set) => {
  if ($accessToken) {
    injectSocketIO().then((io) => {
      const conn = io({ auth: { token: $accessToken } });
      set(conn);
      conn.on("player", (me: Player) => {
        player.set(me);
      });
      // connection.send("authenticate");
    });
  }
});
