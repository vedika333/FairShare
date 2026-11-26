import type { Member, Payment } from "@/lib/types";
import { ROTATION_LOG_COPY } from "@/lib/copy";
import { formatRupees, formatShortDate, initials } from "@/lib/format";
import { Card } from "@/components/ui/Card";

type RotationLogProps = {
  payments: Payment[];
  members: Member[];
};

// Read-only list of rounds covered so far, newest first, with no emojis in list rows
export function RotationLog({ payments, members }: RotationLogProps) {
  const memberById = new Map(members.map((m) => [m.id, m]));
  // API returns payments oldest-first, so reverse a copy for newest-first display
  const newestFirst = [...payments].reverse();

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-ink">{ROTATION_LOG_COPY.title}</h2>
        <span className="text-xs text-muted">{payments.length} total</span>
      </div>

      {newestFirst.length === 0 ? (
        <p className="py-8 text-center font-display italic text-xl text-muted">
          {ROTATION_LOG_COPY.emptyState}
        </p>
      ) : (
        <ul>
          {newestFirst.map((payment) => {
            const payer = memberById.get(payment.paid_by);
            const payerName = payer?.name ?? "Someone";
            const avatar = payer?.avatar || initials(payerName);

            return (
              <li
                key={payment.id}
                className="hairline-row py-3 flex items-center justify-between gap-3 animate-row-fade-in"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-full bg-peach/70 border-[1.5px] border-ink flex items-center justify-center text-lg shrink-0">
                    {avatar}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {payment.note?.trim() || ROTATION_LOG_COPY.fallbackNote}
                    </p>
                    <p className="text-xs text-muted truncate">
                      Covered by {payerName} · {formatShortDate(payment.created_at)}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-sm font-semibold text-ink shrink-0">
                  {formatRupees(Number(payment.amount))}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
