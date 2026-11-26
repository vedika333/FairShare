import type { Mood } from "@/lib/types";
import { getMood } from "@/lib/mood";

type FairnessRingProps = {
  score: number;
  vacationMode: boolean;
};

const MOOD_META: Record<Mood, { stroke: string; badgeBg: string; caption: string }> = {
  calm: {
    stroke: "var(--color-mint)",
    badgeBg: "bg-mint/35",
    caption: "everything's soft and even",
  },
  tense: {
    stroke: "var(--color-peach)",
    badgeBg: "bg-peach/65",
    caption: "a small cloud has appeared",
  },
  dramatic: {
    stroke: "var(--color-rose)",
    badgeBg: "bg-rose/25",
    caption: "episode 7: someone is paying for everyone",
  },
};

// Circular SVG meter showing the 0-100 fairness score and a mood-matched caption
export function FairnessRing({ score, vacationMode }: FairnessRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const mood = getMood(clamped, vacationMode);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const meta = MOOD_META[mood];

  return (
    <div className="flex flex-col items-center text-center pt-5">
      <div className={`relative w-32 h-32 ${mood === "dramatic" ? "animate-gentle-pulse" : ""}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="color-mix(in srgb, var(--color-ink) 10%, transparent)"
            strokeWidth="10"
          />
          {/* Animated score arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={meta.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.7s ease-out" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl leading-none text-ink">{clamped}</span>
          <span className="text-[11px] uppercase tracking-wider text-muted mt-1">{mood}</span>
        </div>
      </div>

      <p className={`mt-3 px-3.5 py-1 rounded-full font-display italic text-lg text-ink ${meta.badgeBg}`}>
        &ldquo;{meta.caption}&rdquo;
      </p>
    </div>
  );
}
