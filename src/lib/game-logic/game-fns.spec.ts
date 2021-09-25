import { createGame, startGame } from "./game-fns";
import { fakePlayer } from "./player-fns";

describe("startGame()", () => {
  const host = fakePlayer();
  it("should assign a turn", () => {
    const game = createGame(host);
    expect(game.turn).toBeUndefined();
    const startedGame = startGame(game);
    expect(typeof startedGame.turn).toBe("string");
  });
});
