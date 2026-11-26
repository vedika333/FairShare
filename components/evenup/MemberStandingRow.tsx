import type { Balance } from "@/lib/types";
import { EVEN_UP_COPY } from "@/lib/copy";
import { formatRupees, initials } from "@/lib/format";

type MemberStandingRowProps = {
  balance: Balance;
  maxAbsNet: number;
};

// Shows a member's covered total, ahead/behind/even badge, and a centred standing bar
export function MemberStandingRow({ balance, maxAbsNet }: MemberStandingRowProps) {
  const { name, avatar, paid, net } = balance;
  const isAhead = net >= 1;
  const isBehind = net <= -1;

  // Percentage width from the centre (0% to 50%) relative to the largest standing
  const pct = maxAbsNet > 0 ? Math.min(50, (Math.abs(net) / maxAbsNet) * 50) : 0;

  return (
    <li className="hairline-row py-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-full bg-peach/70 border-[1.5px] border-ink flex items-center justify-center text-base shrink-0">
            {avatar || initials(name)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{name}</p>
            <p className="text-xs text-muted font-mono">
              covered {formatRupees(paid)} so far
            </p>
          </div>
        </div>

        {isAhead && (
          <span className="px-2.5 py-1 rounded-full bg-mint/45 border border-ink/20 font-mono text-xs font-semibold text-ink shrink-0">
            {formatRupees(net)} {EVEN_UP_COPY.ahead}
          </span>
        )}
        {isBehind && (
          <span className="px-2.5 py-1 rounded-full bg-rose/25 border border-ink/20 font-mono text-xs font-semibold text-ink shrink-0">
            {formatRupees(Math.abs(net))} {EVEN_UP_COPY.behind}
          </span>
        )}
        {!isAhead && !isBehind && (
          <span className="px-2.5 py-1 rounded-full bg-paper border border-ink/20 text-xs font-medium text-muted shrink-0">
            {EVEN_UP_COPY.even}
          </span>
        )}
      </div>

      {/* Centred bar: behind grows left in rose, ahead grows right in mint */}
      <div className="relative h-2 w-full rounded-full bg-paper border border-ink/15 overflow-hidden">
        <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-ink/30 -translate-x-1/2 z-10" />
        {isAhead && (
          <div
            className="absolute top-0 bottom-0 left-1/2 bg-mint rounded-r-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        )}
        {isBehind && (
          <div
            className="absolute top-0 bottom-0 right-1/2 bg-rose rounded-l-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </li>
  );
}
