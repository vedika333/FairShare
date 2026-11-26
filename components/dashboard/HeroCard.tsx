import type { Stats } from "@/lib/types";
import { formatRupees } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { FairnessRing } from "./FairnessRing";

type HeroCardProps = {
  stats: Stats;
  currentMemberId: string | null;
};

// Main ticket-style summary card with total group spend, your balance badge, and the fairness ring
export function HeroCard({ stats, currentMemberId }: HeroCardProps) {
  const me = stats.balances.find((b) => b.id === currentMemberId);
  const net = me ? me.net : 0;

  let badgeText = "You're all square";
  let badgeClass = "bg-mint/40 text-ink";

  // Small threshold avoids floating-point noise showing "₹0.00"
  if (net > 0.5) {
    badgeText = `You are owed ${formatRupees(net)}`;
    badgeClass = "bg-lilac/60 text-ink";
  } else if (net < -0.5) {
    badgeText = `You owe ${formatRupees(Math.abs(net))}`;
    badgeClass = "bg-peach/80 text-ink";
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 pb-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Total Group Spend
          </p>
          <p className="font-display text-5xl leading-none text-ink mt-1.5">
            {formatRupees(stats.totalSpend)}
          </p>
        </div>

        <span
          className={`px-3 py-1.5 rounded-full border-[1.5px] border-ink text-xs font-semibold shrink-0 ${badgeClass}`}
        >
          {badgeText}
        </span>
      </div>

      <div className="ticket-perforation" />

      <FairnessRing score={stats.score} mood={stats.mood} />
    </Card>
  );
}
