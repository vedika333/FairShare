"use client";

import type { Transfer } from "@/lib/types";
import { formatRupees, initials } from "@/lib/format";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

type SettleSheetProps = {
  transfer: Transfer | null;
  onClose: () => void;
  onConfirmDemo: () => void;
};

// Hackathon mock for PayMe/FPS — does not write to the database or change any standing
export function SettleSheet({ transfer, onClose, onConfirmDemo }: SettleSheetProps) {
  if (!transfer) return null;

  function handleOpenPayMe() {
    onClose();
    onConfirmDemo();
  }

  return (
    <Sheet open={Boolean(transfer)} onClose={onClose} title="Settle via PayMe">
      <div className="space-y-5">
        <div className="bg-paper border-[1.5px] border-ink rounded-2xl p-4 text-center space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            To {transfer.to.name}
          </p>
          <p className="font-mono text-4xl font-semibold text-ink">
            {formatRupees(transfer.amount)}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/60 border border-ink/20 text-xs font-medium text-ink">
            <span>{transfer.to.avatar || initials(transfer.to.name)}</span>
            <span>{transfer.to.name}</span>
          </div>
        </div>

        <Button variant="rose" onClick={handleOpenPayMe} className="w-full">
          Open PayMe
        </Button>

        <p className="text-center text-xs text-muted">
          Demo preview only — no real transfer or database change is made.
        </p>
      </div>
    </Sheet>
  );
}
