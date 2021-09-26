import { v4 as uuid } from "uuid";
import { shuffle } from "lodash-es";
import type { Dice, Game, Player } from "./types";
import { bankableDiceValues, rollDice } from "./dice-fns";
import { createChip } from "./chip-fns";

export function createGame(): Game {
  return {
    id: uuid(),
    phase: "BEGIN",
    players: [],
    dices: Array(8)
      .fill(null)
      .map(() => rollDice()),
    chips: Array(16)
      .fill(null)
      .map((_, i) => createChip(i + 21)),
  };
}

export function hasHostAccess(game: Game, player: Player): boolean {
  // The first player in the array assumes the role of the host
  return player.id === game.players[0].id;
}
export function startGame(game: Game): Game {
  if (game.turn) {
    throw new Error("Already started");
  }
  const players = shuffle(game.players);
  if (players.length === 0) {
    // @todo Disable single player
    throw new Error("Minimum of 2 players is required");
  }
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

export function joinGame(game: Game, ...players: Player[]): Game {
  if (game.turn) {
    // @todo Disable joining after start?
  }
  const combined = game.players;
  for (const player of players) {
    const index = combined.findIndex((p) => p.id === player.id);
    if (index === -1) {
      combined.push(player);
    } else {
      combined[index] = player; // Already joined, just update
    }
  }
  return {
    ...game,
    players: combined,
  };
}

export function throwDiceInGame(game: Game): Game {
  if (game.phase === "THROWN") {
    throw new Error("Must select dice, before throwing again");
  }
  let dices: Dice[];
  if (game.phase === "BEGIN") {
    dices = game.dices.map(() => rollDice());
  } else {
    let rolled = false;
    dices = game.dices.map((dice) => {
      if (dice.banked) {
        return dice;
      }
      rolled = true;
      return rollDice();
    });
    if (rolled === false) {
      throw new Error("No dices left to throw");
    }
  }
  if (bankableDiceValues(dices).length === 0) {
    // No moves left? next player
    // @todo Lose chip
    return {
      ...game,
      // turn: nextPlayerId(game),
      phase: "BEGIN",
      dices,
    };
  }
  return {
    ...game,
    phase: "THROWN",
    dices,
  };
}
export function bankValueInGame(game: Game, value: number): Game {
  if (game.phase !== "THROWN") {
    throw new Error("Must throw dice, before banking");
  }
  const bankable = bankableDiceValues(game.dices);
  if (bankable.indexOf(value) === -1) {
    throw new Error(`Value: ${value} is not bankable`);
  }
  const dices = game.dices.map((dice) => ({
    ...dice,
    banked: dice.value === value ? true : dice.banked,
  }));
  // @todo If no dices left and score not enough? lose chip & next player
  return {
    ...game,
    phase: "BANKED",
    dices,
  };
}
