import styles from "./Applications.module.css";

const applications = [
  {
    domain: "Board games",
    title: "Go & Chess",
    outcome: "State-of-the-art play",
    summary:
      "MCTS broke through in Go and Chess by combining tree search with learned rollouts — proving the algorithm scales to enormous branching factors when paired with strong evaluation.",
    tags: ["Perfect information", "Two-player"],
  },
  {
    domain: "Game AI",
    title: "AlphaGo lineage",
    outcome: "Superhuman benchmarks",
    summary:
      "DeepMind's AlphaGo fused MCTS with neural networks for policy and value — a template for how modern game AI balances search depth with learned intuition.",
    tags: ["Neural MCTS", "Policy network"],
  },
  {
    domain: "Planning",
    title: "Real-world decision trees",
    outcome: "Beyond games",
    summary:
      "MCTS generalizes to scheduling, robotics, and resource allocation — anywhere you can simulate forward and score outcomes under uncertainty.",
    tags: ["Simulation", "Planning"],
  },
  {
    domain: "Research testbed",
    title: "Snake as an open problem",
    outcome: "Under-evaluated domain",
    summary:
      "Snake is a dynamic, deterministic, perfect-information single-agent game whose difficulty shifts as the body grows — MCTS had not been properly evaluated here until recent work.",
    tags: ["Single-agent", "Dynamic difficulty"],
  },
];

export function Applications() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Real-world & research</p>
          <h1 className={styles.title}>
            Learning from recent{" "}
            <em className={styles.emphasis}>applications</em>
          </h1>
          <p className={styles.lede}>
            Summaries that explain where MCTS has mattered — what was tried, what
            worked, and why it matters beyond the paper.
          </p>
        </header>

        <ul className={styles.grid}>
          {applications.map((app, i) => (
            <li key={app.title}>
              <article
                className={`${styles.card} reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <div className={styles.cardTop}>
                  <span className={styles.domain}>{app.domain}</span>
                  <span className={styles.outcome}>{app.outcome}</span>
                </div>
                <h3 className={styles.cardTitle}>{app.title}</h3>
                <p className={styles.summary}>{app.summary}</p>
                <ul className={styles.tags} aria-label="Topics">
                  {app.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
