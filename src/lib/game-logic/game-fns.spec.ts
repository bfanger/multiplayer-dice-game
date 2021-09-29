import { bankedDice, thrownDice } from "./dice-fns";
import { createGame, joinGame, startGame, throwDiceInGame } from "./game-fns";
import { fakePlayer } from "./player-fns";

describe("game-fns", () => {
  const twoPlayerGame = joinGame(createGame(), fakePlayer(), fakePlayer());
  describe("startGame()", () => {
    it("should assign a turn", () => {
      expect(twoPlayerGame.turn).toBeUndefined();
      const startedGame = startGame(twoPlayerGame);
      expect(typeof startedGame.turn).toBe("string");
      expect(startedGame.phase).toBe("NEW-TURN");
    });
  });

  describe("throwDice()", () => {
    const startedGame = startGame(twoPlayerGame);
    it("should roll the dice", () => {
      const before = JSON.stringify(startedGame.dices);
      const thrown = throwDiceInGame(startedGame);
      expect(thrown.phase).toBe("THROWN");
      expect(thrownDice(thrown.dices)).toHaveLength(thrown.dices.length);
      expect(bankedDice(thrown.dices)).toHaveLength(0);
      expect(JSON.stringify(thrown.dices)).not.toBe(before); // is random, so could the result be the same
    });
    it("should only roll the non-banked dice", () => {
      const first = throwDiceInGame(startedGame);
      first.dices = [
        { value: 1, banked: true },
        { value: 2, banked: true },
        { value: 5 },
        { value: 5 },
        { value: 5 },
        { value: 5 },
        { value: 5 },
      ];
      first.phase = "BANKED";
      const before = JSON.stringify(first.dices);
      const second = throwDiceInGame(first);
      expect(bankedDice(second.dices)).toEqual(bankedDice(first.dices));
      expect(JSON.stringify(second.dices)).not.toBe(before); // is random, so could the result be the same
    });
  });
});
