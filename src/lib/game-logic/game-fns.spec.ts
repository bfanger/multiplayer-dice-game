import { createGame, startGame, throwDice } from "./game-fns";
import { fakePlayer } from "./player-fns";

const player = fakePlayer();
describe("startGame()", () => {
  it("should assign a turn", () => {
    const game = createGame(player);
    expect(game.turn).toBeUndefined();
    const startedGame = startGame(game);
    expect(typeof startedGame.turn).toBe("string");
    expect(startedGame.phase).toBe("BEGIN");
  });
});

describe("throwDice()", () => {
  const freshGame = startGame(createGame(player));
  const thrown = throwDice(freshGame, player);
  expect(thrown.phase).toBe("THROWN");
});
