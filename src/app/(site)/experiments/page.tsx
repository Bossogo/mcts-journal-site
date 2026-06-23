import type { Metadata } from "next";
import { ExperimentLab } from "@/components/ExperimentLab";

export const metadata: Metadata = {
  title: "Experiments — MCTS Web Journal",
  description:
    "Test and evaluate modified MCTS algorithms in games with interactive simulations.",
};

export default function ExperimentsPage() {
  return <ExperimentLab />;
}
