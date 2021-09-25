import { v4 as uuid } from "uuid";
import { shuffle } from "lodash-es";
import type { Game, Player } from "./types";
import { rollDice } from "./dice-fns";
import { createChip } from "./chip-fns";

export function createGame(host: Player): Game {
  return {
    id: uuid(),
    hostPlayerId: host.id,
    phase: "BEGIN",
    players: [host],
    dices: Array(7)
      .fill(null)
      .map(() => rollDice()),
    chips: Array(15)
      .fill(null)
      .map((_, i) => createChip(i + 21)),
  };
}

export function hostFromGame(game: Game): Player {
  const host = game.players.find((player) => player.id === game.hostPlayerId);
  if (!host) {
    throw new Error("Missing host");
  }
  return host;
}

export function startGame(game: Game): Game {
  if (game.turn) {
    throw new Error("Already started");
  }
  const players = shuffle(game.players);
  return {
    ...game,
    phase: "BEGIN",
    players,
    turn: players[0].id,
  };
}

export function updatePlayer(game: Game, player: Player): Game {
  // @todo throw error when player is not participating?
  return {
    ...game,
    players: game.players.map((p) => {
      if (p.id === player.id) {
        return player;
      }
      return p;
    }),
  };
}

export function joinGame(game: Game, player: Player): Game {
  if (game.turn) {
    // @todo Disable joining after start?
  }
  if (game.players.some((p) => p.id === player.id)) {
    return updatePlayer(game, player); // already joined
  }
  return {
    ...game,
    players: [...game.players, player],
  };
}

export function throwDice(game: Game, player: Player): Game {
  if (player.id !== game.turn) {
    throw new Error("Not your turn");
  }
  const phase: Game["phase"] = "THROWN";
  const dices = game.dices.map((dice) => {
    if (dice.banked) {
      return dice;
    }
    return rollDice();
  });
  // @todo rules
  return {
    ...game,
    phase,
    dices,
  };
}
