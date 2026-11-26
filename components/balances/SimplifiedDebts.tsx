import type { Balance, Transfer } from "@/lib/types";
import { simplifyDebts } from "@/lib/debts";
import { formatRupees, initials } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type SimplifiedDebtsProps = {
  balances: Balance[];
  currentMemberId: string | null;
  onSettle: (transfer: Transfer) => void;
};

// Card showing the fewest transfers needed to settle the group, plus a PayMe button for your debts
export function SimplifiedDebts({
  balances,
  currentMemberId,
  onSettle,
}: SimplifiedDebtsProps) {
  const transfers = simplifyDebts(balances);

  return (
    <Card>
      <h2 className="font-display text-2xl text-ink mb-2">Simplified Debts</h2>

      {transfers.length === 0 ? (
        <p className="py-6 text-center font-display italic text-xl text-muted">
          Nobody owes anything, the group is at peace
        </p>
      ) : (
        <ul>
          {transfers.map((t) => {
            const isMyDebt = currentMemberId === t.from.id;
            return (
              <li
                key={`${t.from.id}-${t.to.id}`}
                className="hairline-row py-3 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 text-sm font-medium text-ink">
                    <span>{t.from.avatar || initials(t.from.name)}</span>
                    <span className="truncate">{t.from.name}</span>
                    <span className="text-muted">→</span>
                    <span>{t.to.avatar || initials(t.to.name)}</span>
                    <span className="truncate">{t.to.name}</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-ink shrink-0">
                    {formatRupees(t.amount)}
                  </span>
                </div>

                {isMyDebt && (
                  <Button
                    variant="soft"
                    onClick={() => onSettle(t)}
                    className="w-full text-xs"
                  >
                    Settle via PayMe · {formatRupees(t.amount)}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
