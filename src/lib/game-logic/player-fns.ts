import { jwtDecode } from "jwt-decode";
import type { Player, PlayerAvatar } from "./types";

export function fakePlayer(): Player {
  fakePlayer.autoincrement += 1;
  return {
    id: `fake${fakePlayer.autoincrement}`,
    avatar: avatarFromId("000000000000000000000000"),
    name: `Fake player (${fakePlayer.autoincrement})`,
  };
}
fakePlayer.autoincrement = 0;

export function playerFromToken(jwt: string): Player {
  const data = jwtDecode<{
    oid: string;
    name: string;
    unique_name: string;
  }>(jwt);
  return {
    id: data.oid,
    name: data.name,
    avatar: avatarFromId(data.oid),
  };
}

export function avatarFromId(oid: string): PlayerAvatar {
  return {
    index: oidToNumber(oid, 0, 4),
    color: `oklch(0.95 0.1 ${oidToNumber(oid, 4, 360)} / 1);`,
  };
}

export function playerOnline(player: Player): Player {
  return {
    ...player,
    connected: true,
  };
}
export function playerOffline(player: Player): Player {
  return {
    ...player,
    connected: undefined,
  };
}

export function playerById(players: Player[], id: string): Player {
  const player = players.find((entry) => entry.id === id);
  if (!player) {
    throw new Error(`Player ${id} not found`);
  }
  return player;
}

function oidToNumber(hex: string, offset: number, max: number): number {
  const section = hex.slice(offset, offset + Math.log(max));
  const value = parseInt(section, 16);
  return value % max;
}
