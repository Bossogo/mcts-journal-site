import { AdvancementChart } from "@/components/AdvancementChart";
import { TreeCanvas } from "@/components/TreeCanvas";
import styles from "./VisualizeSection.module.css";

export function VisualizeSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
          <div className={styles.grid}>
            <div>
            <p className={styles.eyebrow}>
              Charts · diagrams · search trees
            </p>
            <h1 className={styles.title}>
              Visualize recent{" "}
              <em className={styles.emphasis}>advancements</em>
            </h1>
            <p className={styles.lede}>
              Interactive charts and diagrams break down how MCTS techniques
              evolved — from UCB1 selection to neural-guided search — so you
              can see what changed and why it mattered.
            </p>
            <AdvancementChart />
          </div>
          <div className={styles.visual}>
            <div className={styles.visualHeader}>
              <span className={styles.visualLabel}>Live search tree</span>
            </div>
            <TreeCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
