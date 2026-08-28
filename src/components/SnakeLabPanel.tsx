"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  applyMove,
  cloneState,
  createInitialState,
  visitedCells,
} from "@/lib/snake/game";
import { GRID_SIZE, type Direction, type GameState, type MCTSConfig } from "@/lib/snake/types";
import {
  DEFAULT_MCTS_CONFIG,
  type WorkerSearchRequest,
  type WorkerSearchResponse,
} from "@/lib/snake/types";
import styles from "./ExperimentLab.module.css";

const EXPLORATION_OPTIONS = [
  { label: "√2", value: Math.SQRT2 },
  { label: "1.2", value: 1.2 },
  { label: "0.8", value: 0.8 },
];

const EPSILON_OPTIONS = [
  { label: "0.30", value: 0.3 },
  { label: "0.01", value: 0.01 },
];

const SIM_OPTIONS = [
  { label: "500", value: 500 },
  { label: "2K", value: 2000 },
  { label: "10K", value: 10000 },
];

type LabStatus = "ready" | "thinking" | "playing" | "paused" | "gameover";

interface HistoryFrame {
  state: GameState;
}

interface SnakeLabPanelProps {
  active: boolean;
}

function statusLabel(status: LabStatus): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "thinking":
      return "Thinking…";
    case "playing":
      return "Playing";
    case "paused":
      return "Paused";
    case "gameover":
      return "Game over";
  }
}

function statusClass(status: LabStatus): string {
  if (status === "thinking") return styles.panelStatusThinking;
  if (status === "gameover") return styles.panelStatusOver;
  return styles.panelStatus;
}

export function SnakeLabPanel({ active }: SnakeLabPanelProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<HistoryFrame[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [config, setConfig] = useState<MCTSConfig>(DEFAULT_MCTS_CONFIG);

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingResolveRef = useRef<((dir: Direction | null) => void) | null>(null);
  const playingRef = useRef(false);
  const gameStateRef = useRef<GameState | null>(null);
  const historyIndexRef = useRef(0);
  const historyRef = useRef<HistoryFrame[]>([]);
  const searchingRef = useRef(false);
  const configRef = useRef(config);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    if (!active) return;

    const worker = new Worker(
      new URL("../lib/snake/mcts.worker.ts", import.meta.url),
    );

    worker.onmessage = (event: MessageEvent<WorkerSearchResponse>) => {
      const msg = event.data;
      if (msg.type !== "result") return;
      if (msg.id !== requestIdRef.current) return;

      setThinking(false);
      const resolve = pendingResolveRef.current;
      pendingResolveRef.current = null;
      resolve?.(msg.result.bestDirection);
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [active]);

  const resetGame = useCallback(() => {
    const initial = createInitialState();
    const frame = { state: initial };
    setGameState(initial);
    setHistory([frame]);
    setHistoryIndex(0);
    setPlaying(false);
    setThinking(false);
  }, []);

  useEffect(() => {
    if (active && !gameState) resetGame();
    if (!active) {
      setGameState(null);
      setHistory([]);
      setHistoryIndex(0);
      setPlaying(false);
      setThinking(false);
    }
  }, [active, gameState, resetGame]);

  const searchBestMove = useCallback(
    (state: GameState): Promise<Direction | null> => {
      return new Promise((resolve) => {
        const worker = workerRef.current;
        if (!worker || state.gameOver) {
          resolve(null);
          return;
        }

        requestIdRef.current += 1;
        pendingResolveRef.current = resolve;
        setThinking(true);

        const request: WorkerSearchRequest = {
          type: "search",
          id: requestIdRef.current,
          state: cloneState(state),
          config: configRef.current,
        };
        worker.postMessage(request);
      });
    },
    [],
  );

  const commitMove = useCallback(
    (direction: Direction) => {
      const current = gameStateRef.current;
      if (!current || current.gameOver) return;

      const next = applyMove(current, direction);
      setGameState(next);

      const atTip =
        historyIndexRef.current === historyRef.current.length - 1;
      if (atTip) {
        setHistory((prev) => [...prev, { state: next }]);
        setHistoryIndex((prev) => prev + 1);
      } else {
        setHistory((prev) => {
          const trimmed = prev.slice(0, historyIndexRef.current + 1);
          return [...trimmed, { state: next }];
        });
        setHistoryIndex((prev) => prev + 1);
      }
    },
    [],
  );

  const runAutoStep = useCallback(async () => {
    const state = gameStateRef.current;
    if (!state || state.gameOver || thinking || searchingRef.current) return;
    if (historyIndexRef.current !== historyRef.current.length - 1) return;

    searchingRef.current = true;
    const direction = await searchBestMove(state);
    searchingRef.current = false;

    if (!direction || !playingRef.current) return;
    if (historyIndexRef.current !== historyRef.current.length - 1) return;

    commitMove(direction);
  }, [thinking, searchBestMove, commitMove]);

  useEffect(() => {
    if (!playing || !active || thinking || !gameState || gameState.gameOver)
      return;
    if (historyIndex !== history.length - 1) return;

    void runAutoStep();
  }, [
    playing,
    active,
    thinking,
    gameState,
    historyIndex,
    history.length,
    runAutoStep,
  ]);

  useEffect(() => {
    if (
      playing &&
      gameState?.gameOver &&
      historyIndex === history.length - 1
    ) {
      setPlaying(false);
    }
  }, [playing, gameState, historyIndex, history.length]);

  const stepHistory = useCallback((delta: number) => {
    setPlaying(false);
    setHistoryIndex((idx) => {
      const next = Math.max(
        0,
        Math.min(historyRef.current.length - 1, idx + delta),
      );
      const frame = historyRef.current[next];
      if (frame) setGameState(cloneState(frame.state));
      return next;
    });
  }, []);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (!gameStateRef.current || gameStateRef.current.gameOver) return;
        if (historyIndexRef.current !== historyRef.current.length - 1) return;
        setPlaying((p) => !p);
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        stepHistory(-1);
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        stepHistory(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, stepHistory]);

  const status: LabStatus = !active || !gameState
    ? "ready"
    : gameState.gameOver
      ? "gameover"
      : thinking
        ? "thinking"
        : playing
          ? "playing"
          : "paused";

  const visited = gameState ? visitedCells(gameState) : new Set<string>();
  const snakeSet = new Set(
    gameState?.snake.map((p) => `${p.x},${p.y}`) ?? [],
  );
  const headKey = gameState
    ? `${gameState.snake[0].x},${gameState.snake[0].y}`
    : "";

  const gridLabel = gameState
    ? `Snake grid, score ${gameState.score}, ${statusLabel(status)}`
    : "Snake grid preview";

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelLabel}>Snake · MCTS search</span>
        <span className={statusClass(status)} aria-live="polite">
          {active && gameState
            ? `${statusLabel(status)} · ${gameState.score} pts`
            : statusLabel(status)}
        </span>
      </div>

      <div
        className={styles.snakeGrid}
        role="img"
        aria-label={gridLabel}
        tabIndex={active ? 0 : -1}
        onKeyDown={(event: ReactKeyboardEvent) => event.stopPropagation()}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const row = Math.floor(i / GRID_SIZE);
          const col = i % GRID_SIZE;
          const key = `${col},${row}`;
          const isSnake = snakeSet.has(key);
          const isHead = key === headKey;
          const isApple =
            gameState &&
            gameState.apple.x === col &&
            gameState.apple.y === row;
          const isVisited = visited.has(key);

          return (
            <span
              key={i}
              className={[
                styles.cell,
                isSnake && styles.cellSnake,
                isHead && styles.cellHead,
                isApple && styles.cellApple,
                isVisited && !isSnake && !isApple && styles.cellVisited,
              ]
                .filter(Boolean)
                .join(" ")}
            />
          );
        })}
      </div>

      <div className={styles.controls}>
        <span className={styles.controlKey}>Space</span>
        <span className={styles.controlAction}>Play / Pause</span>
        <span className={styles.controlKey}>← →</span>
        <span className={styles.controlAction}>Step moves</span>
        {active && history.length > 1 && (
          <span className={styles.historyHint}>
            Move {historyIndex + 1} / {history.length}
          </span>
        )}
      </div>

      <div className={styles.params}>
        <p className={styles.paramsLabel}>Tunable parameters</p>
        <dl className={styles.paramsList}>
          <div className={styles.paramRow}>
            <dt>Exploration C</dt>
            <dd>
              {EXPLORATION_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  disabled={!active}
                  className={
                    config.explorationC === opt.value
                      ? styles.paramActive
                      : styles.paramValue
                  }
                  onClick={() =>
                    setConfig((c) => ({ ...c, explorationC: opt.value }))
                  }
                >
                  {opt.label}
                </button>
              ))}
            </dd>
          </div>
          <div className={styles.paramRow}>
            <dt>Rollout ε-greedy</dt>
            <dd>
              {EPSILON_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  disabled={!active}
                  className={
                    config.rolloutEpsilon === opt.value
                      ? styles.paramActive
                      : styles.paramValue
                  }
                  onClick={() =>
                    setConfig((c) => ({ ...c, rolloutEpsilon: opt.value }))
                  }
                >
                  {opt.label}
                </button>
              ))}
            </dd>
          </div>
          <div className={styles.paramRow}>
            <dt>Simulations / move</dt>
            <dd>
              {SIM_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  disabled={!active}
                  className={
                    config.simulationsPerMove === opt.value
                      ? styles.paramActive
                      : styles.paramValue
                  }
                  onClick={() =>
                    setConfig((c) => ({
                      ...c,
                      simulationsPerMove: opt.value,
                    }))
                  }
                >
                  {opt.label}
                </button>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
