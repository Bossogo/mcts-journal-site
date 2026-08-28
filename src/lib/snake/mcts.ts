import {
  applyMove,
  cloneState,
  legalMoves,
  manhattanDistance,
} from "./game";
import type {
  ActionStats,
  Direction,
  GameState,
  MCTSConfig,
  SearchResult,
} from "./types";

const DEATH_PENALTY = -10;
const MAX_ROLLOUT_DEPTH = 200;

interface MCTSNode {
  state: GameState;
  parent: MCTSNode | null;
  action: Direction | null;
  children: Map<Direction, MCTSNode>;
  visits: number;
  totalReward: number;
  untriedMoves: Direction[];
}

function createNode(
  state: GameState,
  parent: MCTSNode | null,
  action: Direction | null,
): MCTSNode {
  return {
    state: cloneState(state),
    parent,
    action,
    children: new Map(),
    visits: 0,
    totalReward: 0,
    untriedMoves: [...legalMoves(state)],
  };
}

function uctScore(
  child: MCTSNode,
  parentVisits: number,
  explorationC: number,
): number {
  if (child.visits === 0) return Infinity;
  const exploitation = child.totalReward / child.visits;
  const exploration =
    explorationC * Math.sqrt(Math.log(parentVisits) / child.visits);
  return exploitation + exploration;
}

function selectChild(node: MCTSNode, explorationC: number): MCTSNode {
  let best: MCTSNode | null = null;
  let bestScore = -Infinity;
  for (const child of node.children.values()) {
    const score = uctScore(child, node.visits, explorationC);
    if (score > bestScore) {
      bestScore = score;
      best = child;
    }
  }
  return best!;
}

function select(node: MCTSNode, explorationC: number): MCTSNode {
  let current = node;
  while (current.children.size > 0 && current.untriedMoves.length === 0) {
    if (current.state.gameOver) break;
    current = selectChild(current, explorationC);
  }
  return current;
}

function expand(node: MCTSNode): MCTSNode {
  const moveIndex = Math.floor(Math.random() * node.untriedMoves.length);
  const move = node.untriedMoves.splice(moveIndex, 1)[0];
  const childState = applyMove(node.state, move);
  const child = createNode(childState, node, move);
  node.children.set(move, child);
  return child;
}

function greedyTowardApple(
  state: GameState,
  moves: Direction[],
): Direction {
  const head = state.snake[0];
  let best = moves[0];
  let bestDist = Infinity;
  for (const move of moves) {
    const next = applyMove(state, move);
    if (next.gameOver) continue;
    const dist = manhattanDistance(next.snake[0], next.apple);
    if (dist < bestDist) {
      bestDist = dist;
      best = move;
    }
  }
  return best;
}

function rollout(state: GameState, epsilon: number): number {
  let current = cloneState(state);
  let reward = 0;
  const startScore = current.score;

  for (let depth = 0; depth < MAX_ROLLOUT_DEPTH; depth++) {
    if (current.gameOver) break;

    const moves = legalMoves(current);
    if (moves.length === 0) {
      current = { ...current, gameOver: true };
      break;
    }

    const move =
      Math.random() < epsilon
        ? moves[Math.floor(Math.random() * moves.length)]
        : greedyTowardApple(current, moves);

    current = applyMove(current, move);
  }

  reward += current.score - startScore;
  if (current.gameOver) reward += DEATH_PENALTY;
  return reward;
}

function backprop(node: MCTSNode, reward: number): void {
  let current: MCTSNode | null = node;
  while (current) {
    current.visits += 1;
    current.totalReward += reward;
    current = current.parent;
  }
}

export function createMCTSTree(state: GameState): MCTSNode {
  return createNode(state, null, null);
}

export function runMCTS(
  state: GameState,
  config: MCTSConfig,
  existingRoot?: MCTSNode | null,
): { result: SearchResult; root: MCTSNode } {
  const moves = legalMoves(state);
  if (moves.length === 0) {
    return {
      result: {
        bestDirection: null,
        actionStats: [],
        simulationsRun: 0,
      },
      root: existingRoot ?? createMCTSTree(state),
    };
  }

  if (moves.length === 1) {
    return {
      result: {
        bestDirection: moves[0],
        actionStats: [{ direction: moves[0], visits: 1, value: 0 }],
        simulationsRun: 0,
      },
      root: existingRoot ?? createMCTSTree(state),
    };
  }

  let root = existingRoot ?? createMCTSTree(state);
  root.state = cloneState(state);
  if (root.untriedMoves.length === 0 && root.children.size === 0) {
    root.untriedMoves = [...legalMoves(state)];
  }

  for (let i = 0; i < config.simulationsPerMove; i++) {
    let node = select(root, config.explorationC);

    if (!node.state.gameOver && node.untriedMoves.length > 0) {
      node = expand(node);
    }

    const reward = rollout(node.state, config.rolloutEpsilon);
    backprop(node, reward);
  }

  const actionStats: ActionStats[] = [];
  let bestDirection: Direction | null = null;
  let bestVisits = -1;

  for (const [direction, child] of root.children) {
    actionStats.push({
      direction,
      visits: child.visits,
      value: child.visits > 0 ? child.totalReward / child.visits : 0,
    });
    if (child.visits > bestVisits) {
      bestVisits = child.visits;
      bestDirection = direction;
    }
  }

  actionStats.sort((a, b) => b.visits - a.visits);

  return {
    result: {
      bestDirection,
      actionStats,
      simulationsRun: config.simulationsPerMove,
    },
    root,
  };
}

/** Promote chosen child to root; rebuild if missing or after apple eat. */
export function advanceTree(
  root: MCTSNode,
  direction: Direction,
  newState: GameState,
  ateApple: boolean,
): MCTSNode {
  if (ateApple) return createMCTSTree(newState);

  const child = root.children.get(direction);
  if (child) {
    child.parent = null;
    child.state = cloneState(newState);
    child.untriedMoves = [...legalMoves(newState)];
    return child;
  }

  return createMCTSTree(newState);
}

export type { MCTSNode };
