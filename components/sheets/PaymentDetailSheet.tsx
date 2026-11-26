"use client";

import type { Member, Payment } from "@/lib/types";
import { ROTATION_LOG_COPY } from "@/lib/copy";
import { formatRupees, formatShortDate } from "@/lib/format";
import { Sheet } from "@/components/ui/Sheet";

type PaymentDetailSheetProps = {
  payment: Payment | null;
  members: Member[];
  onClose: () => void;
};

// Plain read-only detail sheet showing the note, who covered the round, date, and amount
export function PaymentDetailSheet({ payment, members, onClose }: PaymentDetailSheetProps) {
  if (!payment) return null;

  const payer = members.find((m) => m.id === payment.paid_by);
  const payerName = payer?.name ?? "Someone";

  return (
    <Sheet open={Boolean(payment)} onClose={onClose}>
      <div className="flex items-start justify-between gap-4 py-2">
        <div>
          <h2 className="font-display text-3xl text-ink leading-tight">
            {payment.note?.trim() || ROTATION_LOG_COPY.fallbackNote}
          </h2>
          <p className="text-xs text-muted mt-1.5">
            Covered by {payerName} · {formatShortDate(payment.created_at)}
          </p>
        </div>

        <span className="font-mono text-2xl font-semibold text-ink shrink-0">
          {formatRupees(Number(payment.amount))}
        </span>
      </div>
    </Sheet>
  );
}
