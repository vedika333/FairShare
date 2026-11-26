"use client";

import { useEffect, type ReactNode } from "react";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

// Reusable bottom sheet modal that closes when tapping the backdrop or pressing Escape
export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[420px] bg-card border-t-[1.5px] border-x-[1.5px] border-ink rounded-t-3xl px-5 pt-3 pb-7 shadow-[0_-4px_24px_rgba(59,47,51,0.14)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink/20" />
        {title && (
          <h2 className="font-display text-2xl text-ink mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
