import type { Balance, Transfer } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { SimplifiedDebts } from "./SimplifiedDebts";
import { MemberBalanceRow } from "./MemberBalanceRow";

type BalancesViewProps = {
  balances: Balance[];
  currentMemberId: string | null;
  onSettle: (transfer: Transfer) => void;
};

// Balances tab showing simplified transfers first, then each person's net balance bar
export function BalancesView({ balances, currentMemberId, onSettle }: BalancesViewProps) {
  const maxAbsNet = balances.reduce((max, b) => Math.max(max, Math.abs(b.net)), 0);

  return (
    <div className="space-y-5">
      <SimplifiedDebts
        balances={balances}
        currentMemberId={currentMemberId}
        onSettle={onSettle}
      />

      <Card>
        <h2 className="font-display text-2xl text-ink mb-2">Everyone&apos;s Balance</h2>
        <ul>
          {balances.map((balance) => (
            <MemberBalanceRow
              key={balance.id}
              balance={balance}
              maxAbsNet={maxAbsNet}
            />
          ))}
        </ul>
      </Card>
    </div>
  );
}
