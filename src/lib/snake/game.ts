import {
  type Direction,
  type GameState,
  type Point,
  GRID_SIZE,
} from "./types";

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const DELTA: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function isOnSnake(snake: Point[], point: Point): boolean {
  return snake.some((segment) => pointsEqual(segment, point));
}

function randomEmptyCell(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const empty: Point[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return { x: 0, y: 0 };
  return empty[Math.floor(Math.random() * empty.length)];
}

export function createInitialState(): GameState {
  const head = { x: 5, y: 5 };
  const snake = [head, { x: 4, y: 5 }, { x: 3, y: 5 }];
  return {
    snake,
    direction: "right",
    apple: randomEmptyCell(snake),
    score: 0,
    growNext: false,
    moveCount: 0,
    gameOver: false,
  };
}

export function cloneState(state: GameState): GameState {
  return {
    snake: state.snake.map((p) => ({ ...p })),
    direction: state.direction,
    apple: { ...state.apple },
    score: state.score,
    growNext: state.growNext,
    moveCount: state.moveCount,
    gameOver: state.gameOver,
  };
}

function nextHead(head: Point, direction: Direction): Point {
  const d = DELTA[direction];
  return { x: head.x + d.x, y: head.y + d.y };
}

function isOutOfBounds(point: Point): boolean {
  return (
    point.x < 0 ||
    point.x >= GRID_SIZE ||
    point.y < 0 ||
    point.y >= GRID_SIZE
  );
}

export function isFatalMove(state: GameState, direction: Direction): boolean {
  if (state.gameOver) return true;
  if (direction === OPPOSITE[state.direction]) return true;

  const head = nextHead(state.snake[0], direction);
  if (isOutOfBounds(head)) return true;

  const willEat = pointsEqual(head, state.apple);
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  return isOnSnake(bodyToCheck, head);
}

export function legalMoves(state: GameState): Direction[] {
  if (state.gameOver) return [];
  return DIRECTIONS.filter((dir) => !isFatalMove(state, dir));
}

export function applyMove(state: GameState, direction: Direction): GameState {
  const next = cloneState(state);
  if (next.gameOver) return next;
  if (direction === OPPOSITE[next.direction]) return next;

  next.direction = direction;
  const newHead = nextHead(next.snake[0], direction);

  if (isOutOfBounds(newHead)) {
    next.gameOver = true;
    return next;
  }

  const willEat = pointsEqual(newHead, next.apple);
  const bodyToCheck = willEat ? next.snake : next.snake.slice(0, -1);
  if (isOnSnake(bodyToCheck, newHead)) {
    next.gameOver = true;
    return next;
  }

  next.snake = [newHead, ...next.snake];
  const ateApple = willEat;

  if (ateApple) {
    next.score += 1;
    next.growNext = true;
    next.apple = randomEmptyCell(next.snake);
    if (isOnSnake(next.snake, next.apple)) {
      next.apple = randomEmptyCell(next.snake);
    }
  } else {
    next.snake.pop();
    next.growNext = false;
  }

  next.moveCount += 1;
  return next;
}

export function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function visitedCells(state: GameState): Set<string> {
  const visited = new Set<string>();
  for (const segment of state.snake) {
    visited.add(`${segment.x},${segment.y}`);
  }
  return visited;
}
