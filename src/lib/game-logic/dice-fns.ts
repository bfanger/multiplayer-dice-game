import type { Dice } from "./types";

export function rollDice(): Dice {
  return {
    value: Math.floor(Math.random() * 6) + 1,
  };
}

export function diceScore(dice: Dice): number {
  if (dice.value === 6) {
    return 5;
  }
  return dice.value;
}
