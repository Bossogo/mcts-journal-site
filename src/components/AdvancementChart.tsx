import styles from "./AdvancementChart.module.css";

const techniques = [
  { name: "UCB1 selection", year: 2006, impact: 72 },
  { name: "RAVE / AMAF", year: 2007, impact: 58 },
  { name: "Parallel tree search", year: 2010, impact: 65 },
  { name: "Neural policy/value", year: 2016, impact: 95 },
  { name: "Progressive widening", year: 2008, impact: 48 },
  { name: "Virtual loss", year: 2011, impact: 55 },
];

export function AdvancementChart() {
  const maxImpact = Math.max(...techniques.map((t) => t.impact));

  return (
    <div className={styles.chart} role="img" aria-label="Bar chart of MCTS technique impact scores">
      <ul className={styles.bars}>
        {techniques.map((technique) => (
          <li key={technique.name} className={styles.barRow}>
            <span className={styles.barLabel}>{technique.name}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${(technique.impact / maxImpact) * 100}%` }}
              />
            </div>
            <span className={styles.barYear}>{technique.year}</span>
          </li>
        ))}
      </ul>
      <p className={styles.chartNote}>
        Relative impact on search quality — illustrative scale for exploration
      </p>
    </div>
  );
}
