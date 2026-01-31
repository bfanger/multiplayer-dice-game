import type { Game, Player } from "./game-logic/types";
import api from "./services/api";
import auth from "./services/auth.svelte";
import type { Socket } from "socket.io";
import { browser } from "$app/environment";

type Handshake = { auth: { token?: string } };
let ioPromise: ReturnType<typeof injectSocketIO> | undefined;
function injectSocketIO(): Promise<(handshake: Handshake) => Socket> {
  if (typeof window === "undefined") {
    throw new Error("socket.io client is not available in SSR");
  }
  if (typeof ioPromise === "undefined") {
    ioPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.onload = () => {
        const win = window as any;
        resolve(win.io as Promise<(handshake: Handshake) => Socket>);
      };
      s.onerror = () => reject(new Error("socket.io.js failed"));
      s.onabort = () => reject(new Error("socket.io.js was aborted"));
      s.src = "/socket.io/socket.io.js";
      document.head.appendChild(s);
    });
  }
  return ioPromise;
}

class GameState {
  current = $state(undefined as any as Game);

  constructor(initial: Game) {
    this.current = initial;
    $effect(() => {
      const abortController = new AbortController();
      const { signal } = abortController;
      void this.connect(auth.accessToken).then((socket) => {
        if (signal.aborted) {
          socket.disconnect();
          return;
        }
        const set = (game: Game) => {
          this.current = game;
        };
        socket.on(`games/${this.current.id}`, set);
        socket.emit("join", this.current.id);
        signal.addEventListener("abort", () => {
          socket.off(`games/${this.current.id}`, set);
          socket.emit("leave", this.current.id);
          socket.disconnect();
        });
      });
      return () => abortController.abort();
    });
  }

  private async connect(token: string | undefined) {
    const io = await injectSocketIO();
    return io({ auth: { token } });
  }
}

const client = {
  GameState,
  /**
   * Usage:
   * let playerPromise = $derived(client.maybePlayer());
   */
  async maybePlayer(): Promise<Player | undefined> {
    if (!browser || !auth.accessToken) {
      return undefined;
    }
    return client.me();
  },
  async me(): Promise<Player> {
    auth.assertLoggedIn();
    return api.get("me.json"); // @todo cache player info?
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
      { params: { id: gameId } },
    );
  },
  async steal(gameId: string, chipIndex: number): Promise<void> {
    await api.post(
      `games/[id]/steal.json`,
      { chipIndex },
      { params: { id: gameId } },
    );
  },
};

export default client;
