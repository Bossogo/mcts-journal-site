import type { Metadata } from "next";
import { VisualizeSection } from "@/components/VisualizeSection";

export const metadata: Metadata = {
  title: "Visualize — MCTS Web Journal",
  description:
    "Interactive charts and diagrams exploring recent Monte Carlo Tree Search advancements.",
};

export default function VisualizePage() {
  return <VisualizeSection />;
}
