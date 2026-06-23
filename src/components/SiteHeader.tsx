"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/visualize", label: "Visualize" },
  { href: "/applications", label: "Applications" },
  { href: "/experiments", label: "Experiments" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-container">
        <Link href="/" className="site-logo">
          <span className="site-logo-mark" aria-hidden="true">
            ✦
          </span>
          MCTS Web Journal
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/experiments" className="site-nav-cta">
          Open lab
        </Link>
      </div>
    </header>
  );
}
