import { applyMove, createInitialState, legalMoves } from "./game";
import { createMCTSTree, runMCTS } from "./mcts";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`self-check failed: ${message}`);
}

export function runSelfCheck(): void {
  const initial = createInitialState();
  const onSnake = initial.snake.some(
    (s) => s.x === initial.apple.x && s.y === initial.apple.y,
  );
  assert(!onSnake, "apple must not spawn on snake");

  const growState = {
    ...initial,
    snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }],
    direction: "right" as const,
    apple: { x: 6, y: 5 },
    growNext: false,
    score: 0,
    moveCount: 0,
    gameOver: false,
  };
  const afterEat = applyMove(growState, "right");
  assert(afterEat.snake.length === 3, "snake grows by one segment after eating");
  assert(afterEat.growNext, "growNext marks post-eat state for tree reset");
  assert(afterEat.score === 1, "score increments on apple");
  assert(
    !afterEat.snake.some(
      (s) => s.x === afterEat.apple.x && s.y === afterEat.apple.y,
    ),
    "new apple must not spawn on snake body",
  );

  const trapped = {
    ...initial,
    snake: [
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    direction: "right" as const,
    apple: { x: 5, y: 5 },
    growNext: false,
    score: 0,
    moveCount: 0,
    gameOver: false,
  };
  const fatalMoves = ["up", "down", "left", "right"].filter(
    (d) => !legalMoves(trapped).includes(d as "up"),
  );
  assert(fatalMoves.length > 0, "trapped snake should have fatal moves pruned");

  const { result } = runMCTS(initial, {
    explorationC: 1.414,
    rolloutEpsilon: 0.3,
    simulationsPerMove: 50,
  });
  assert(result.bestDirection !== null, "MCTS returns a move for open board");
  assert(result.actionStats.length > 0, "MCTS records action stats");

  createMCTSTree(initial);
}
