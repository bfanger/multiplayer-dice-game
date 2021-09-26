import {
  bankableDiceValues,
  bankedDice,
  bankedDiceValues,
  thrownDice,
} from "./dice-fns";
import type { Dice } from "./types";

describe("dice-fns", () => {
  const nothingBanked: Dice[] = [
    { value: 1 },
    { value: 2 },
    { value: 1 },
    { value: 1 },
  ];
  const someBanked: Dice[] = [
    { value: 2, banked: true },
    { value: 5 },
    { value: 3, banked: true },
    { value: 2 },
    { value: 2, banked: true },
  ];
  const allBanked: Dice[] = [
    { value: 4, banked: true },
    { value: 4, banked: true },
    { value: 5, banked: true },
  ];
  describe("bankedDice()", () => {
    it("should return banked dice sorted by value", () => {
      expect(bankedDice(nothingBanked)).toHaveLength(0);
      expect(bankedDice(allBanked)).toHaveLength(allBanked.length);
      expect(bankedDice(someBanked)).toHaveLength(3);
      expect(bankedDice(someBanked)).toEqual([
        { value: 2, banked: true },
        { value: 2, banked: true },
        { value: 3, banked: true },
      ]);
    });
  });
  describe("thrownDice()", () => {
    it("should return non banked dice unsorted", () => {
      expect(thrownDice(nothingBanked)).toHaveLength(nothingBanked.length);
      expect(thrownDice(allBanked)).toHaveLength(0);
      expect(thrownDice(someBanked)).toHaveLength(2);
      expect(thrownDice(someBanked)).toEqual([{ value: 5 }, { value: 2 }]);
    });
  });
  describe("bankedDiceValues()", () => {
    it("should only return values of the banked dices", () => {
      expect(bankedDiceValues(nothingBanked)).toEqual([]);
      expect(bankedDiceValues(someBanked)).toEqual([2, 3]);
      expect(bankedDiceValues(allBanked)).toEqual([4, 5]);
    });
  });
  describe("bankableDiceValues()", () => {
    it("should only return values of bankable dices", () => {
      expect(bankableDiceValues(nothingBanked)).toEqual([1, 2]);
      expect(bankableDiceValues(someBanked)).toEqual([5]);
      expect(bankableDiceValues(allBanked)).toEqual([]);
    });
  });
});
