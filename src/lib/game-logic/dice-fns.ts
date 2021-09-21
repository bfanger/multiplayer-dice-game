import type { Dice } from "./types";

export function rollDice(): Dice {
  return {
    value: Math.floor(Math.random() * 6) + 1,
    banked: false,
  };
}

export function createDice(): Dice {
  const dice = rollDice();
  dice.banked = true;
  return dice;
}
