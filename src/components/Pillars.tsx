import Link from "next/link";
import styles from "./Pillars.module.css";

const pillars = [
  {
    num: "01",
    before: "Visualize ",
    emphasis: "advancements",
    after: "",
    description:
      "Present the latest improvements and techniques in MCTS research through interactive charts and diagrams that make complex ideas tangible.",
    href: "/visualize",
    cta: "See visualizations",
  },
  {
    num: "02",
    before: "Learn from ",
    emphasis: "applications",
    after: "",
    description:
      "Explore how MCTS powers real-world AI — from board games to cutting-edge projects — with summaries that explain significance and outcomes.",
    href: "/applications",
    cta: "Browse applications",
  },
  {
    num: "03",
    before: "Experiment in ",
    emphasis: "games",
    after: "",
    description:
      "Select testbed games, run modified MCTS algorithms, and interact with simulations to observe how changes affect performance.",
    href: "/experiments",
    cta: "Open lab",
  },
];

export function Pillars() {
  return (
    <section className={styles.section} id="pillars">
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Three ways in</p>
          <h2 className={styles.title}>
            A hub for learning and{" "}
            <em className={styles.emphasis}>experimenting</em>
          </h2>
          <p className={styles.lede}>
            The platform brings together visualization, applied research, and
            hands-on simulation — so you can follow MCTS from theory to
            playable results.
          </p>
        </header>

        <ul className={styles.grid}>
          {pillars.map((pillar, i) => (
            <li key={pillar.num}>
              <article
                className={`${styles.card} reveal reveal-delay-${Math.min(i + 1, 3)}`}
              >
                <span className={styles.num}>{pillar.num}</span>
                <h3 className={styles.cardTitle}>
                  {pillar.before}
                  <em className={styles.emphasis}>{pillar.emphasis}</em>
                  {pillar.after}
                </h3>
                <p className={styles.description}>{pillar.description}</p>
                <Link href={pillar.href} className={styles.cardLink}>
                  {pillar.cta} →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
