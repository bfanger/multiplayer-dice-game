import { orderBy, sum } from "lodash-es";
import type { Chip } from "./types";

export function createChip(nr: number): Chip {
  return {
    value: nr,
  };
}
export function chipPoints(chip: Chip): number {
  if (chip.value >= 33) {
    return 4;
  }
  if (chip.value >= 29) {
    return 3;
  }
  if (chip.value >= 25) {
    return 2;
  }
  return 1;
}

export function chipStack(chips: Chip[], playerId: string): Chip[] {
  return orderBy(
    chips.filter((chip) => chip.playerId === playerId),
    "stackIndex",
  );
}

export function chipStealError(
  chips: Chip[],
  playerId: string,
  score: number,
  chipIndex: number,
): Error | null {
  const chip = chips[chipIndex];
  if (!chip) {
    return new Error("Invalid chipIndex");
  }
  if (chip.disabled) {
    return new Error("Chip is disabled");
  }
  if (chip.value > score) {
    return new Error("Need a higher score");
  }
  if (chip.playerId) {
    if (chip.playerId === playerId) {
      return new Error("Chip already yours");
    }
    const topChip = chipStack(chips, chip.playerId).pop();
    if (chip !== topChip) {
      return new Error("Not on top of the stack");
    }
    if (topChip.value !== score) {
      return new Error("Chip didn't match the score");
    }
  }
  return null;
}

export function chipStealable(
  chips: Chip[],
  playerId: string,
  score: number,
  chipIndex: number,
): boolean {
  return chipStealError(chips, playerId, score, chipIndex) === null;
}

export function allChipsTaken(chips: Chip[]): boolean {
  return chips.every(
    (chip) => typeof chip.playerId !== "undefined" || chip.disabled,
  );
}

export function totalPoints(chips: Chip[]): number {
  return sum(chips.map(chipPoints));
}
