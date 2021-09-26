import { orderBy, uniq, sum } from "lodash-es";
import type { Dice } from "./types";

export function rollDice(): Dice {
  return {
    value: Math.floor(Math.random() * 6) + 1,
  };
}

export function diceScore(dice: Dice): number {
  if (dice.banked) {
    if (dice.value === 6) {
      return 5;
    }
    return dice.value;
  }
  return 0;
}
export function diceScoreSum(dices: Dice[]): number {
  return sum(dices.map(diceScore));
}

export function bankedDice(dices: Dice[]): Dice[] {
  return orderBy(
    dices.filter((dice) => dice.banked),
    "value"
  );
}
export function thrownDice(dices: Dice[]): Dice[] {
  return dices.filter((dice) => typeof dice.banked === "undefined");
}
export function diceValues(dices: Dice[]): number[] {
  return dices.map((dice) => dice.value);
}
export function bankedDiceValues(dices: Dice[]): number[] {
  return uniq(diceValues(bankedDice(dices)));
}

export function bankableDiceValues(dices: Dice[]): number[] {
  const taken = bankedDiceValues(dices);
  return uniq(diceValues(dices).filter((value) => taken.indexOf(value) === -1));
}
