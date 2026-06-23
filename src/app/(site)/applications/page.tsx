import type { Metadata } from "next";
import { Applications } from "@/components/Applications";

export const metadata: Metadata = {
  title: "Applications — MCTS Web Journal",
  description:
    "How Monte Carlo Tree Search is applied in real-world scenarios and cutting-edge AI projects.",
};

export default function ApplicationsPage() {
  return <Applications />;
}
