"use client";

import { useEffect, useRef } from "react";
import type { Member, Payment } from "@/lib/types";
import { formatRupees, formatShortDate, initials } from "@/lib/format";

type RotationTimelineProps = {
  payments: Payment[];
  members: Member[];
};

// Horizontally scrolling stamp strip showing who paid in order (oldest left, newest right)
export function RotationTimeline({ payments, members }: RotationTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const memberById = new Map(members.map((m) => [m.id, m]));

  // Keep the timeline scrolled to the newest stop on the right whenever payments change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = el.scrollWidth;
    }
  }, [payments.length]);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Rotation Timeline
        </p>
        {payments.length > 0 && (
          <span className="text-[11px] text-muted">oldest → newest</span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex items-center overflow-x-auto no-scrollbar pb-1"
      >
        {payments.length === 0 ? (
          <div className="px-4 py-3 rounded-2xl border-[1.5px] border-dashed border-ink/30 bg-card/70 text-center">
            <p className="font-display italic text-base text-muted">first stop</p>
          </div>
        ) : (
          payments.map((payment, index) => {
            const payer = memberById.get(payment.paid_by);
            const avatar = payer?.avatar || initials(payer?.name ?? "?");
            return (
              <div key={payment.id} className="flex items-center shrink-0">
                {index > 0 && (
                  <div className="w-5 border-t-[1.5px] border-dashed border-ink/35" />
                )}
                <div className="w-24 px-2.5 py-2 rounded-2xl bg-card border-[1.5px] border-ink shadow-[2px_2px_0_0_var(--color-ink)] flex flex-col items-center text-center">
                  <span className="text-xl leading-none">{avatar}</span>
                  <span className="font-mono text-xs font-semibold text-ink mt-1.5">
                    {formatRupees(Number(payment.amount))}
                  </span>
                  <span className="text-[10px] text-muted mt-0.5">
                    {formatShortDate(payment.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
