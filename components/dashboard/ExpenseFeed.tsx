import type { Member, Payment } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { ExpenseRow } from "./ExpenseRow";

type ExpenseFeedProps = {
  payments: Payment[];
  members: Member[];
};

// Chronological list of group payments (newest first) with a gentle empty state
export function ExpenseFeed({ payments, members }: ExpenseFeedProps) {
  const memberById = new Map(members.map((m) => [m.id, m]));
  // API returns payments oldest-first, so reverse a copy for newest-first display
  const newestFirst = [...payments].reverse();

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-ink">Receipts</h2>
        <span className="text-xs text-muted">{payments.length} total</span>
      </div>

      {newestFirst.length === 0 ? (
        <p className="py-8 text-center font-display italic text-xl text-muted">
          no receipts yet, the first page is blank
        </p>
      ) : (
        <ul>
          {newestFirst.map((payment) => (
            <ExpenseRow
              key={payment.id}
              payment={payment}
              payer={memberById.get(payment.paid_by)}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
