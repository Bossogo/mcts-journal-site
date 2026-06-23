import Link from "next/link";
import { Pillars } from "@/components/Pillars";
import styles from "./page.module.css";

const stats = [
  { label: "Techniques tracked", value: "12+" },
  { label: "Applications covered", value: "8" },
  { label: "Game testbeds", value: "3" },
  { label: "Interactive viz", value: "Live" },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={`${styles.eyebrow} reveal`}>
            Interactive web journal · Monte Carlo Tree Search
          </p>
          <h1 className={`${styles.heroTitle} reveal reveal-delay-1`}>
            Explore recent MCTS{" "}
            <em className={styles.emphasis}>advancements</em>
          </h1>
          <p className={`${styles.heroLede} reveal reveal-delay-2`}>
            A clear, engaging platform to visualize the latest techniques,
            learn from real-world applications, and experiment with modified
            algorithms in games — all in one interactive hub.
          </p>
          <div className={`${styles.heroActions} reveal reveal-delay-3`}>
            <Link href="/visualize" className={styles.btnPrimary}>
              Start exploring
            </Link>
            <Link href="/experiments" className={styles.btnGhost}>
              Run a simulation
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.statsBar} aria-label="Platform scope">
        <div className={styles.container}>
          <ul className={styles.statsList}>
            {stats.map((stat, i) => (
              <li
                key={stat.label}
                className={`${styles.statItem} reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Pillars />

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <p className={styles.eyebrow}>The full picture</p>
            <h2 className={styles.ctaTitle}>
              Learn, visualize, and{" "}
              <em className={styles.emphasis}>experiment</em>
            </h2>
            <p className={styles.ctaLede}>
              MCTS Web Journal brings together the latest research, real-world
              applications, and playable simulations — so you can go from reading
              about a technique to watching it run in a game.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/visualize" className={styles.btnPrimary}>
                Browse techniques
              </Link>
              <Link href="/experiments" className={styles.btnGhost}>
                Try Snake lab
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
