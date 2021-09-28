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
      s.onerror = () => reject(new Error("socket.io.js failed"));
      s.onabort = () => reject(new Error("socket.io.js was aborted"));
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

  async startGame(gameId: string): Promise<void> {
    await api.post(`games/[id]/start.json`, "", { params: { id: gameId } });
  },
  async joinGame(gameId: string): Promise<void> {
    await api.post(`games/[id]/join.json`, "", { params: { id: gameId } });
  },
  async throwDice(gameId: string): Promise<void> {
    await api.post(`games/[id]/throw.json`, "", { params: { id: gameId } });
  },
  async bankValue(gameId: string, value: number): Promise<void> {
    await api.post(
      `games/[id]/bank.json`,
      { value },
      { params: { id: gameId } }
    );
  },
  async steal(gameId: string, chipIndex: number): Promise<void> {
    await api.post(
      `games/[id]/steal.json`,
      { chipIndex },
      { params: { id: gameId } }
    );
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
};

export default client;
