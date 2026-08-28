export const GRID_SIZE = 10;

export type Direction = "up" | "down" | "left" | "right";

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  snake: Point[];
  direction: Direction;
  apple: Point;
  score: number;
  growNext: boolean;
  moveCount: number;
  gameOver: boolean;
}

export interface MCTSConfig {
  explorationC: number;
  rolloutEpsilon: number;
  simulationsPerMove: number;
}

export const DEFAULT_MCTS_CONFIG: MCTSConfig = {
  explorationC: Math.SQRT2,
  rolloutEpsilon: 0.3,
  simulationsPerMove: 500,
};

export interface ActionStats {
  direction: Direction;
  visits: number;
  value: number;
}

export interface SearchResult {
  bestDirection: Direction | null;
  actionStats: ActionStats[];
  simulationsRun: number;
}

export interface WorkerSearchRequest {
  type: "search";
  id: number;
  state: GameState;
  config: MCTSConfig;
}

export interface WorkerSearchResponse {
  type: "result";
  id: number;
  result: SearchResult;
}
