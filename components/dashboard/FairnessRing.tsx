import type { Mood } from "@/lib/types";
import { RING_CAPTIONS } from "@/lib/copy";

type FairnessRingProps = {
  score: number;
  mood: Mood;
};

const MOOD_STYLES: Record<Mood, { stroke: string; badgeBg: string }> = {
  calm: {
    stroke: "var(--color-mint)",
    badgeBg: "bg-mint/35",
  },
  tense: {
    stroke: "var(--color-peach)",
    badgeBg: "bg-peach/65",
  },
  BALANCED: {
    stroke: "var(--color-rose)",
    badgeBg: "bg-rose/25",
  },
};

// Large (~180px) circular SVG ring showing the 0-100 fairness score and mood caption
export function FairnessRing({ score, mood }: FairnessRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const style = MOOD_STYLES[mood];

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`relative w-[180px] h-[180px] ${mood === "BALANCED" ? "animate-gentle-pulse" : ""}`}
      >
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="color-mix(in srgb, var(--color-ink) 10%, transparent)"
            strokeWidth="12"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={style.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.7s ease-out" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-6xl leading-none text-ink">{clamped}</span>
          <span className="text-[11px] uppercase tracking-wider text-muted mt-1">{mood}</span>
        </div>
      </div>

      <p
        className={`mt-3 px-4 py-1 rounded-full font-display italic text-lg text-ink ${style.badgeBg}`}
      >
        {RING_CAPTIONS[mood]}
      </p>
    </div>
  );
}
