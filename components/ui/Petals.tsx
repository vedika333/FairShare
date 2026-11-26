"use client";

import { useEffect } from "react";

type PetalsProps = {
  active: boolean;
  onDone: () => void;
};

const PETALS = [
  { left: "12%", delay: "0ms", drift: "-18px", color: "bg-rose/70" },
  { left: "22%", delay: "120ms", drift: "16px", color: "bg-peach" },
  { left: "34%", delay: "60ms", drift: "-12px", color: "bg-lilac/80" },
  { left: "44%", delay: "180ms", drift: "22px", color: "bg-rose/60" },
  { left: "54%", delay: "40ms", drift: "-20px", color: "bg-peach" },
  { left: "64%", delay: "140ms", drift: "14px", color: "bg-lilac/80" },
  { left: "74%", delay: "90ms", drift: "-16px", color: "bg-rose/70" },
  { left: "84%", delay: "200ms", drift: "18px", color: "bg-peach" },
  { left: "90%", delay: "100ms", drift: "-10px", color: "bg-lilac/70" },
];

// Celebratory CSS-only petals that float up and fade over ~2 seconds after saving a payment
export function Petals({ active, onDone }: PetalsProps) {
  useEffect(() => {
    if (!active) return;
    // Skip animation duration if the user prefers reduced motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onDone, reduced ? 50 : 2100);
    return () => window.clearTimeout(timer);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 bottom-16 z-40 pointer-events-none overflow-hidden h-64 max-w-[420px] mx-auto"
    >
      {PETALS.map((petal, idx) => (
        <span
          key={idx}
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            ["--petal-drift" as string]: petal.drift,
          }}
          className={`absolute bottom-0 w-3.5 h-5 rounded-tl-full rounded-br-full border border-ink/25 animate-petal-float ${petal.color}`}
        />
      ))}
    </div>
  );
}
