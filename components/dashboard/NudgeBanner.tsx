"use client";

import { useState } from "react";
import type { Nudge } from "@/lib/types";

type NudgeBannerProps = {
  nudges: Nudge[];
  currentMemberId: string | null;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Soft anonymous banner shown when someone sent the active member a nudge in the last 24 hours
export function NudgeBanner({ nudges, currentMemberId }: NudgeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !currentMemberId) return null;

  const now = Date.now();
  const hasRecentNudge = nudges.some((n) => {
    if (n.to_member !== currentMemberId) return false;
    const age = now - new Date(n.created_at).getTime();
    return age >= 0 && age <= ONE_DAY_MS;
  });

  if (!hasRecentNudge) return null;

  return (
    <div className="bg-lilac/60 border-[1.5px] border-ink rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[2px_2px_0_0_var(--color-ink)]">
      <p className="text-xs font-medium text-ink leading-snug">
        Someone is gently thinking of you. Maybe it&apos;s your turn?
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss reminder"
        className="text-xs font-semibold text-ink/70 hover:text-ink px-2 py-1 rounded-full shrink-0 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}
