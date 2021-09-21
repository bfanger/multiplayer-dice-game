import { createGame, startGame } from "./game-fns";
import { fakePlayer } from "./player-fns";

describe("startGame()", () => {
  const host = fakePlayer();
  it("should assign a turn", () => {
    const game = createGame(host);
    expect(game.turn).toBeUndefined();
    startGame(game);
    expect(typeof game.turn).toBe("string");
  });
});
