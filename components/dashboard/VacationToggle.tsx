"use client";

import { useState } from "react";
import { setVacationMode } from "@/lib/api";

type VacationToggleProps = {
  code: string;
  vacationMode: boolean;
  onToggled: () => Promise<void> | void;
};

// Small ticket-stub switch in the header for toggling Trip (Vacation) mode
export function VacationToggle({ code, vacationMode, onToggled }: VacationToggleProps) {
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    if (busy) return;
    setBusy(true);
    try {
      await setVacationMode(code, !vacationMode);
      await onToggled();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy}
      aria-pressed={vacationMode}
      className={`inline-flex items-center gap-2 min-h-11 px-3.5 py-2 rounded-xl border-[1.5px] border-dashed border-ink text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
        vacationMode ? "bg-sky text-ink" : "bg-card text-muted hover:text-ink"
      }`}
    >
      <span>Trip mode</span>
      <span
        className={`w-6 h-3.5 rounded-full border border-ink relative transition-colors ${
          vacationMode ? "bg-ink" : "bg-paper"
        }`}
      >
        <span
          className={`absolute top-0.5 w-2 h-2 rounded-full transition-transform ${
            vacationMode ? "translate-x-3 bg-sky" : "translate-x-0.5 bg-ink"
          }`}
        />
      </span>
    </button>
  );
}
