import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer-inner">
          <p className="site-footer-brand">
            <span aria-hidden="true">✦</span> MCTS Web Journal
          </p>
          <p className="site-footer-copy">
            Visualize advancements · Learn from applications · Experiment in
            games.
          </p>
          <p className="site-footer-meta">
            © {new Date().getFullYear()} ·{" "}
            <Link href="/">Interactive MCTS hub</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
