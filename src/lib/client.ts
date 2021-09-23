import type { Socket } from "socket.io";
import { derived, get, writable } from "svelte/store";
import type { Readable } from "svelte/store";
import type { Game, Player } from "./game-logic/types";
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
const playerStore = writable<Player | undefined>(undefined);
const gameStore = writable<Game | undefined>(undefined);

const socket: Readable<Socket> = derived(accessToken, ($accessToken, set) => {
  if ($accessToken) {
    injectSocketIO().then((io) => {
      const conn: Socket = io({ auth: { token: $accessToken } });
      set(conn);
      conn.on("player", (me: Player) => {
        playerStore.set(me);
      });
      conn.on("game", (game: Game) => {
        gameStore.set(game);
      });
    });
  }
});

export const player = derived([playerStore, socket], ([$player]) => $player);
export const game = Object.assign(
  derived([gameStore, socket], ([$game]) => $game),
  {
    host() {
      const $socket = get(socket);
      if (!$socket) {
        throw new Error("Hosting game failed");
      }
      $socket.emit("host");
    },

    start() {
      const $socket = get(socket);
      const $game = get(game);
      if (!$socket || !$game) {
        throw new Error("throwing dice failed");
      }
      $socket.emit("start", $game.id);
    },

    throwDice() {
      const $socket = get(socket);
      const $player = get(player);
      const $game = get(game);
      if (!$socket || !$player || !$game) {
        throw new Error("throwing dice failed");
      }
      $socket.emit("throw", $game.id);
    },
  }
);
