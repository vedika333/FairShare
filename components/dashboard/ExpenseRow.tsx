import type { Member, Payment } from "@/lib/types";
import { formatRupees, formatShortDate, initials } from "@/lib/format";

type ExpenseRowProps = {
  payment: Payment;
  payer: Member | undefined;
};

// Single receipt row showing who paid, what it was for, the rupee amount, and the short date
export function ExpenseRow({ payment, payer }: ExpenseRowProps) {
  const payerName = payer?.name ?? "Someone";
  const avatar = payer?.avatar || initials(payerName);

  return (
    <li className="hairline-row py-3.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-10 h-10 rounded-full bg-peach/70 border-[1.5px] border-ink flex items-center justify-center text-lg shrink-0">
          {avatar}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink truncate">
            {payment.note?.trim() || "Shared expense"}
          </p>
          <p className="text-xs text-muted truncate">
            Paid by {payerName} · {formatShortDate(payment.created_at)}
          </p>
        </div>
      </div>

      <span className="font-mono text-sm font-semibold text-ink shrink-0">
        {formatRupees(Number(payment.amount))}
      </span>
    </li>
  );
}
