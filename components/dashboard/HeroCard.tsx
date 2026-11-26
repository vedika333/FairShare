import type { Stats } from "@/lib/types";
import { DASHBOARD_COPY } from "@/lib/copy";
import { formatRupees } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { FairnessRing } from "./FairnessRing";

type HeroCardProps = {
  stats: Stats;
  vacationMode: boolean;
  currentMemberId: string | null;
};

// Main ticket-style summary card with total group spend, your balance badge, and the fairness ring
export function HeroCard({ stats, vacationMode, currentMemberId }: HeroCardProps) {
  const copy = vacationMode ? DASHBOARD_COPY.trip : DASHBOARD_COPY.normal;
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
            {copy.totalLabel}
          </p>
          <p className="font-display text-5xl leading-none text-ink mt-1.5">
            {formatRupees(stats.totalSpend)}
          </p>
          <p className="text-xs text-muted mt-1">{copy.heroCaption}</p>
        </div>

        <span
          className={`px-3 py-1.5 rounded-full border-[1.5px] border-ink text-xs font-semibold shrink-0 ${badgeClass}`}
        >
          {badgeText}
        </span>
      </div>

      <div className="ticket-perforation" />

      <FairnessRing score={stats.score} vacationMode={vacationMode} />
    </Card>
  );
}
