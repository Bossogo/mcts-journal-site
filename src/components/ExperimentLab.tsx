"use client";

import { useEffect, useState } from "react";
import { runSelfCheck } from "@/lib/snake/self-check";
import { SnakeLabPanel } from "./SnakeLabPanel";
import styles from "./ExperimentLab.module.css";

const features = [
  "Play and pause simulations with space",
  "Step backward and forward through moves",
  "Compare rollout policy parameters side by side",
  "Run parallel MCTS workers on one tree",
];

export function ExperimentLab() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      runSelfCheck();
    }
  }, []);

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

            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                if (active) {
                  setActive(false);
                  requestAnimationFrame(() => setActive(true));
                } else {
                  setActive(true);
                }
              }}
            >
              {active ? "Restart Snake lab" : "Launch Snake lab"}
            </button>
            {!active && (
              <p className={styles.comingSoon}>
                Press launch to start MCTS-driven play. Use space to
                auto-play and arrow keys to step through moves.
              </p>
            )}
          </div>

          <SnakeLabPanel active={active} />
        </div>
      </div>
    </section>
  );
}
