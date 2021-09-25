import { readable } from "svelte/store";
import type { Readable } from "svelte/store";
import type { Handshake, Socket } from "socket.io/dist/socket";
import type { Game, Player } from "./game-logic/types";
import api from "./services/api";
import type { Fetch } from "./services/api";
import auth from "./services/auth";

let ioPromise: ReturnType<typeof injectSocketIO> | undefined;
function injectSocketIO(): Promise<(handshake: Partial<Handshake>) => Socket> {
  if (typeof window === "undefined") {
    throw new Error("socket.io client is not available in SSR");
  }
  if (typeof ioPromise === "undefined") {
    ioPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.onload = () => {
        const win = window as any;
        resolve(win.io);
      };
      s.onerror = reject;
      s.onabort = reject;
      s.src = "/socket.io/socket.io.js";
      document.head.appendChild(s);
    });
  }
  return ioPromise;
}
const client = {
  async me(fetch?: Fetch): Promise<Player> {
    const accessToken = await auth.accessToken().catch(() => false);
    if (!accessToken) {
      throw new Error("Not logged in");
    }
    return api.get("me.json", { fetch }); // @todo cache player info?
  },
  async createGame(): Promise<string> {
    const response = await api.post(`games.json`, "");
    return response.id;
  },

  async startGame(id: string): Promise<void> {
    await api.post(`games/[id]/start.json`, "", { params: { id } });
  },
  async throwDice(id: string): Promise<void> {
    await api.post(`games/[id]/throw.json`, "", { params: { id } });
  },
  async gameState(id: string): Promise<Readable<Game>> {
    const io = await injectSocketIO();
    const accessToken = await auth.accessToken().catch(() => undefined);
    return readable<Game>(undefined, (set) => {
      const socket = io({ auth: { token: accessToken } });
      socket.on(`games/${id}`, set);
      socket.emit("join", id);
      return () => {
        socket.off(`games/${id}`, set);
        socket.emit("leave", id);
        socket.disconnect();
      };
    });
  },
  //   const $socket = get(socket);
  //   const $gameUpdate = get(gameUpdate);
  //   if (!$socket || !$gameUpdate) {
  //     throw new Error("throwing dice failed");
  //   }
  //   $socket.emit("start", $gameUpdate.id);
  // },

  // throwDice() {
  //   const $socket = get(socket);
  //   const $player = get(player);
  //   const $game = get(gameUpdate);
  //   if (!$socket || !$player || !$game) {
  //     throw new Error("throwing dice failed");
  //   }
  //   $socket.emit("throw", $game.id);
  // },
};

export default client;
