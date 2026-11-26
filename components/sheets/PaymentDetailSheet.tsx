"use client";

import type { Member, Payment } from "@/lib/types";
import { formatRupees, formatShortDate, initials } from "@/lib/format";
import { Sheet } from "@/components/ui/Sheet";

type PaymentDetailSheetProps = {
  payment: Payment | null;
  members: Member[];
  onClose: () => void;
};

// Read-only receipt breakdown dividing a payment equally across all group members
export function PaymentDetailSheet({ payment, members, onClose }: PaymentDetailSheetProps) {
  if (!payment) return null;

  const payer = members.find((m) => m.id === payment.paid_by);
  const payerName = payer?.name ?? "Someone";
  const total = Number(payment.amount);
  const perPerson = members.length > 0 ? total / members.length : total;

  return (
    <Sheet open={Boolean(payment)} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-ink leading-tight">
              {payment.note?.trim() || "Shared expense"}
            </h2>
            <p className="text-xs text-muted mt-1">
              Paid by {payerName} · {formatShortDate(payment.created_at)}
            </p>
          </div>
          <span className="font-mono text-2xl font-semibold text-ink shrink-0">
            {formatRupees(total)}
          </span>
        </div>

        <div className="ticket-perforation" />

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">
            Split equally ({members.length} {members.length === 1 ? "person" : "people"})
          </p>
          <ul>
            {members.map((member) => {
              const isPayer = member.id === payment.paid_by;
              return (
                <li
                  key={member.id}
                  className="hairline-row py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-peach/70 border-[1.5px] border-ink flex items-center justify-center text-sm">
                      {member.avatar || initials(member.name)}
                    </span>
                    <span className="text-sm font-medium text-ink">{member.name}</span>
                  </div>

                  {isPayer ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-mint/45 border border-ink/20 text-xs font-semibold text-ink">
                      paid
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-muted">
                      owes {payerName} {formatRupees(perPerson)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Sheet>
  );
}
