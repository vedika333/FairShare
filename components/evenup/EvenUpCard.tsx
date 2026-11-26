import type { Balance, Transfer } from "@/lib/types";
import { EVEN_UP_COPY } from "@/lib/copy";
import { evenUp } from "@/lib/debts";
import { formatRupees, initials } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type EvenUpCardProps = {
  balances: Balance[];
  currentMemberId: string | null;
  onSettle: (transfer: Transfer) => void;
};

// Card listing the fewest transfers to even everyone up, with a mock PayMe button for your turns
export function EvenUpCard({ balances, currentMemberId, onSettle }: EvenUpCardProps) {
  const transfers = evenUp(balances);

  return (
    <Card>
      <h2 className="font-display text-2xl text-ink mb-2">{EVEN_UP_COPY.title}</h2>

      {transfers.length === 0 ? (
        <p className="py-6 text-center font-display italic text-xl text-muted">
          {EVEN_UP_COPY.empty}
        </p>
      ) : (
        <ul>
          {transfers.map((t) => {
            const isMyTurnToSend = currentMemberId === t.from.id;
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

                {isMyTurnToSend && (
                  <Button
                    variant="soft"
                    onClick={() => onSettle(t)}
                    className="w-full text-xs"
                  >
                    Settle via PayMe {formatRupees(t.amount)}
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
