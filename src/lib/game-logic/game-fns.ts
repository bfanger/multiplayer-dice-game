import { v4 as uuid } from "uuid";
import { shuffle } from "lodash-es";
import type { Chip, Dice, Game, Player } from "./types";
import {
  bankableDiceValues,
  bankedDice,
  diceScoreTotal,
  rollDice,
} from "./dice-fns";
import {
  chipStack,
  createChip,
  chipStealError,
  chipStealable,
} from "./chip-fns";

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
function nextPlayerId(game: Game): string {
  const index = game.players.findIndex((p) => p.id === game.turn);
  if (index === -1) {
    throw new Error("Current player not found");
  }
  return game.players[(index + 1) % game.players.length].id;
}

export function lostTurn(game: Game): Game {
  if (!game.turn) {
    throw new Error("Not started");
  }
  const stack = chipStack(game.chips, game.turn);
  let { chips } = game;
  if (stack.length === 0) {
    const largestAvailableChip = [...game.chips]
      .reverse()
      .find(
        (chip) =>
          typeof chip.playerId === "undefined" &&
          typeof chip.disabled === "undefined"
      );
    if (typeof largestAvailableChip === "undefined") {
      // @todo game completed
    } else {
      const index = game.chips.indexOf(largestAvailableChip);
      chips = [
        ...game.chips.slice(0, index),
        { value: largestAvailableChip.value, disabled: true },
        ...game.chips.slice(index + 1),
      ];
    }
  } else {
    // Lose top chip
    const topChip = stack[stack.length - 1];
    const index = game.chips.indexOf(topChip);
    chips = [
      ...game.chips.slice(0, index),
      { value: topChip.value },
      ...game.chips.slice(index + 1),
    ];
  }
  return {
    ...game,
    phase: "BEGIN",
    turn: nextPlayerId(game),
    chips,
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
    // No moves left?
    return lostTurn({
      ...game,
      dices,
    });
  }
  return {
    ...game,
    phase: "THROWN",
    dices,
  };
}
export function bankValueInGame(game: Game, value: number): Game {
  if (!game.turn) {
    throw new Error("Not started");
  }
  const playerId = game.turn;
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
  if (
    bankedDice(dices).length === game.dices.length ||
    bankableDiceValues(game.dices).length === 0
  ) {
    const score = diceScoreTotal(dices);
    const chipAvailable = game.chips.some((_, index) =>
      chipStealable(game.chips, playerId, score, index)
    );
    if (chipAvailable === false) {
      return lostTurn({ ...game, dices });
    }
  }
  return {
    ...game,
    phase: "BANKED",
    dices,
  };
}

export function stealChip(game: Game, chipIndex: number): Game {
  if (!game.turn) {
    throw new Error("Not started");
  }
  if (game.phase !== "BANKED") {
    throw new Error("Must throw dice");
  }
  const score = diceScoreTotal(game.dices);
  const err = chipStealError(game.chips, game.turn, score, chipIndex);
  if (err !== null) {
    throw err;
  }
  const chip = game.chips[chipIndex];
  const stack = chipStack(game.chips, game.turn);
  const chips: Chip[] = [
    ...game.chips.slice(0, chipIndex),
    { value: chip.value, playerId: game.turn, stackIndex: stack.length },
    ...game.chips.slice(chipIndex + 1),
  ];
  return {
    ...game,
    chips,
    phase: "BEGIN",
    turn: nextPlayerId(game),
  };
}
