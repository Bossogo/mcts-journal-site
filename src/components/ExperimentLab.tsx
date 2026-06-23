import styles from "./ExperimentLab.module.css";

const features = [
  "Play and pause simulations with space",
  "Step backward and forward through moves",
  "Compare rollout policy parameters side by side",
  "Run parallel MCTS workers on one tree",
];

const parameters = [
  { label: "Exploration C", values: ["√2", "1.2", "0.8"] },
  { label: "Rollout ε-greedy", values: ["0.30", "0.01"] },
  { label: "Simulations / move", values: ["500", "2K", "10K"] },
];

export function ExperimentLab() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Hands-on lab</p>
            <h1 className={styles.title}>
              Experiment with modified algorithms in{" "}
              <em className={styles.emphasis}>games</em>
            </h1>
            <p className={styles.lede}>
              Pick a testbed, tune MCTS parameters, and watch the search tree
              respond. Snake is the featured game — a dynamic single-agent
              environment where difficulty shifts as the snake grows.
            </p>

            <ul className={styles.featureList}>
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <button type="button" className={styles.btnPrimary} disabled>
              Launch Snake lab
            </button>
            <p className={styles.comingSoon}>
              Interactive simulations coming soon — benchmark runs and
              matplotlib-style charts will live here.
            </p>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelLabel}>Snake · MCTS search</span>
              <span className={styles.panelStatus}>Ready</span>
            </div>

            <div className={styles.snakeGrid} aria-hidden="true">
              {Array.from({ length: 100 }).map((_, i) => {
                const row = Math.floor(i / 10);
                const col = i % 10;
                const isSnake =
                  (row === 4 && col >= 2 && col <= 6) ||
                  (row === 5 && col === 6) ||
                  (row === 6 && col >= 4 && col <= 6);
                const isHead = row === 4 && col === 6;
                const isApple = row === 2 && col === 7;
                const isVisited = isSnake || (row === 3 && col >= 5 && col <= 7);

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
            </div>

            <div className={styles.params}>
              <p className={styles.paramsLabel}>Tunable parameters</p>
              <dl className={styles.paramsList}>
                {parameters.map((param) => (
                  <div key={param.label} className={styles.paramRow}>
                    <dt>{param.label}</dt>
                    <dd>
                      {param.values.map((value) => (
                        <span
                          key={value}
                          className={
                            value === "0.30" || value === "√2"
                              ? styles.paramActive
                              : styles.paramValue
                          }
                        >
                          {value}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
