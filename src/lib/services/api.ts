import type { GameListing } from "src/routes/api/games.json";
import type { Game, Player } from "../game-logic/types";
import auth from "./auth";

type GetResponse = {
  "games.json": GameListing[];
  "games/[id].json": Game;
  "me.json": Player;
};
type PostResponse = {
  "games.json": { id: string };
  "games/[id]/start.json": null;
  "games/[id]/throw.json": null;
  "games/[id]/bank.json": null;
};

function buildUrl(path: string, params: Record<string, string>) {
  const query = { ...params };
  let url = path;
  for (const [param, value] of Object.entries(params)) {
    const replaced = url.replace(`[${param}]`, value as string);
    if (replaced !== url) {
      url = replaced;
      delete query[param];
    }
  }
  const search = new URLSearchParams(query).toString();
  return `/api/${url}${search ? `?${search}` : ""}`;
}
async function authenticated(
  headers: RequestInit["headers"]
): Promise<RequestInit["headers"]> {
  try {
    const accessToken = await auth.accessToken();
    if (!accessToken || "Authorization" in (headers || {})) {
      return headers;
    }
    return {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    };
  } catch (_) {
    return headers;
  }
}

export type Fetch = (
  info: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

type Config = RequestInit & {
  params?: Record<string, string>;
  fetch?: Fetch;
};
async function wrapped(
  method: RequestInit["method"],
  path: string,
  config: Config
): Promise<any> {
  const init = { ...config };
  const params = init.params || {};
  delete init.params;
  let { fetch } = init;
  if (!fetch) {
    if (typeof window === "undefined") {
      throw new Error("Missing config.fetch");
    }
    fetch = window.fetch;
  }
  init.method = method;
  init.headers = await authenticated(init.headers);
  const url = buildUrl(path, params);
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(
      `${method} ${url} failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
const api = {
  get<T extends keyof GetResponse>(
    path: T,
    config?: Config
  ): Promise<GetResponse[T]> {
    return wrapped("GET", path, config || {});
  },
  async post<T extends keyof PostResponse>(
    path: T,
    data: unknown,
    config?: Config
  ): Promise<PostResponse[T]> {
    return wrapped("POST", path, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};
export default api;
