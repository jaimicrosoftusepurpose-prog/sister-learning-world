import { useMemo } from "react";

const COLORS = [
  "#FF6B9D",
  "#B088F9",
  "#FFD93D",
  "#6BCB77",
  "#4ECDC4",
  "#FF8A65",
  "#F48FB1",
  "#81D4FA",
  "#FFB74D",
  "#AED581",
];

export default function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.6,
        size: 6 + Math.random() * 8,
        shape: Math.random() > 0.5 ? "50%" : "2px",
      })),
    [count],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size,
            borderRadius: p.shape,
          }}
        />
      ))}
    </div>
  );
}
