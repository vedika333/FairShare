import type { Balance, Transfer } from "@/lib/types";
import { EVEN_UP_COPY } from "@/lib/copy";
import { Card } from "@/components/ui/Card";
import { EvenUpCard } from "./EvenUpCard";
import { MemberStandingRow } from "./MemberStandingRow";

type EvenUpViewProps = {
  balances: Balance[];
  currentMemberId: string | null;
  onSettle: (transfer: Transfer) => void;
};

// Even up tab showing simplified transfers and where each member stands
export function EvenUpView({ balances, currentMemberId, onSettle }: EvenUpViewProps) {
  const maxAbsNet = balances.reduce((max, b) => Math.max(max, Math.abs(b.net)), 0);

  return (
    <div className="space-y-5">
      <EvenUpCard
        balances={balances}
        currentMemberId={currentMemberId}
        onSettle={onSettle}
      />

      <Card>
        <h2 className="font-display text-2xl text-ink mb-2">
          {EVEN_UP_COPY.standingsTitle}
        </h2>
        <ul>
          {balances.map((balance) => (
            <MemberStandingRow
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
