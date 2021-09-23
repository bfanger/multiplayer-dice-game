/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
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

export function startGame(game: Game): void {
  if (game.turn) {
    throw new Error("Already started");
  }
  game.players = shuffle(game.players);
  game.turn = game.players[0].id;
}

export function joinGame(game: Game, player: Player): void {
  if (game.turn) {
    // @todo Disable joining after start?
    // throw new Error("Already started");
  }
  if (game.players.some((p) => p.id === player.id)) {
    return; // already joined
  }
  game.players.push(player);
}

export function throwDice(game: Game, player: Player): void {
  if (player.id !== game.turn) {
    throw new Error("Not your turn");
  }
  game.dices = game.dices.map((dice) => {
    if (dice.banked) {
      return dice;
    }
    return rollDice();
  });
  // @todo rules
}
