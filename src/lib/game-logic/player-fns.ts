import jwtDecode from "jwt-decode";
import gravatar from "gravatar";
import type { Player } from "./types";

export function fakePlayer(): Player {
  fakePlayer.autoincrement += 1;
  return {
    id: `fake${fakePlayer.autoincrement}`,
    avatar: "anonymous.jpg",
    name: `Fake player (${fakePlayer.autoincrement})`,
    connected: false,
  };
}
fakePlayer.autoincrement = 0;

export function playerFromToken(jwt: string): Player {
  const data = jwtDecode(jwt) as any;
  return {
    id: data.oid,
    name: data.name,
    avatar: gravatar.url(data.unique_name),
    connected: true,
  };
}
