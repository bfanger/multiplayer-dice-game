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
