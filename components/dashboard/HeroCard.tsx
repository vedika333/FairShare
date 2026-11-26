import type { Payment, Stats } from "@/lib/types";
import { formatRupees } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { FairnessRing } from "./FairnessRing";

type HeroCardProps = {
  stats: Stats;
  payments: Payment[];
  currentMemberId: string | null;
};

// Hero card featuring the 180px fairness ring, total covered line, and recent rounds count
export function HeroCard({ stats, payments, currentMemberId }: HeroCardProps) {
  const recentRounds = payments.slice(-4);
  const coveredByMe = recentRounds.filter((p) => p.paid_by === currentMemberId).length;

  return (
    <Card className="space-y-4">
      <div className="flex flex-col items-center">
        <FairnessRing score={stats.score} mood={stats.mood} />
        <p className="text-xs text-muted mt-3">
          Total covered so far:{" "}
          <span className="font-mono font-medium text-ink">
            {formatRupees(stats.totalSpend)}
          </span>
        </p>
      </div>

      <div className="ticket-perforation" />

      <p className="text-center text-xs font-medium text-ink">
        You&apos;ve covered {coveredByMe} of the last {recentRounds.length}{" "}
        {recentRounds.length === 1 ? "round" : "rounds"}
      </p>
    </Card>
  );
}
