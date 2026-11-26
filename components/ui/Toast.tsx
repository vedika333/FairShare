"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string | null;
  onDone: () => void;
  durationMs?: number;
};

// Small floating pill notification that disappears automatically after a few seconds
export function Toast({ message, onDone, durationMs = 2400 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDone, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, onDone, durationMs]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-ink text-card text-xs font-medium px-4 py-2.5 rounded-full border-[1.5px] border-ink shadow-[2px_2px_0_0_var(--color-rose)]">
        {message}
      </div>
    </div>
  );
}
