"use client";

import { useEffect, useRef } from "react";
import styles from "./TreeCanvas.module.css";

interface Node {
  x: number;
  y: number;
  r: number;
  visits: number;
  children?: Node[];
}

const tree: Node = {
  x: 200,
  y: 40,
  r: 10,
  visits: 1240,
  children: [
    {
      x: 120,
      y: 110,
      r: 8,
      visits: 680,
      children: [
        { x: 70, y: 180, r: 5, visits: 320 },
        { x: 140, y: 190, r: 5, visits: 210 },
      ],
    },
    {
      x: 200,
      y: 120,
      r: 8,
      visits: 340,
      children: [{ x: 200, y: 200, r: 5, visits: 180 }],
    },
    {
      x: 290,
      y: 105,
      r: 8,
      visits: 220,
      children: [
        { x: 250, y: 185, r: 5, visits: 95 },
        { x: 320, y: 175, r: 5, visits: 78 },
        { x: 290, y: 210, r: 4, visits: 42 },
      ],
    },
  ],
};

function getTreeBounds(
  node: Node,
  bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  },
) {
  bounds.minX = Math.min(bounds.minX, node.x - node.r - 4);
  bounds.maxX = Math.max(bounds.maxX, node.x + node.r + 4);
  bounds.minY = Math.min(bounds.minY, node.y - node.r - 4);
  bounds.maxY = Math.max(bounds.maxY, node.y + node.r + 4);
  node.children?.forEach((child) => getTreeBounds(child, bounds));
  return bounds;
}

function drawTree(
  ctx: CanvasRenderingContext2D,
  node: Node,
  parent?: Node,
  time = 0,
) {
  if (parent) {
    const gradient = ctx.createLinearGradient(parent.x, parent.y, node.x, node.y);
    gradient.addColorStop(0, "rgba(212, 132, 90, 0.5)");
    gradient.addColorStop(1, "rgba(212, 132, 90, 0.15)");
    ctx.beginPath();
    ctx.moveTo(parent.x, parent.y);
    ctx.lineTo(node.x, node.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const pulse = 1 + Math.sin(time * 0.002 + node.visits * 0.01) * 0.08;
  const radius = node.r * pulse;
  const intensity = Math.min(node.visits / 1240, 1);

  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(196, 90, 26, ${0.35 + intensity * 0.55})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(212, 132, 90, ${0.2 + intensity * 0.3})`;
  ctx.lineWidth = 1;
  ctx.stroke();

  node.children?.forEach((child) => drawTree(ctx, child, node, time));
}

export function TreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let start = performance.now();

    const render = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < rect.width; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, rect.height);
        ctx.stroke();
      }
      for (let i = 0; i < rect.height; i += 32) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(rect.width, i);
        ctx.stroke();
      }

      const time = prefersReducedMotion ? 0 : now - start;
      const bounds = getTreeBounds(tree);
      const treeCenterX = (bounds.minX + bounds.maxX) / 2;
      const treeCenterY = (bounds.minY + bounds.maxY) / 2;

      ctx.save();
      ctx.translate(rect.width / 2 - treeCenterX, rect.height / 2 - treeCenterY);
      drawTree(ctx, tree, undefined, time);
      ctx.restore();

      if (!prefersReducedMotion) {
        frameRef.current = requestAnimationFrame(render);
      }
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.overlay}>
        <span className={styles.overlayLabel}>Live simulation</span>
        <span className={styles.overlayValue}>1,240 visits</span>
      </div>
    </div>
  );
}
