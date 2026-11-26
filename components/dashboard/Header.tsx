import type { Member } from "@/lib/types";
import { DASHBOARD_COPY } from "@/lib/copy";
import { initials } from "@/lib/format";
import { VacationToggle } from "./VacationToggle";

export type DashboardView = "activity" | "balances";

type HeaderProps = {
  groupName: string;
  code: string;
  members: Member[];
  vacationMode: boolean;
  view: DashboardView;
  onChangeView: (view: DashboardView) => void;
  onCopyCode: () => void;
  onRefresh: () => void;
  refreshing: boolean;
};

// Top header showing group title, trip status, avatars, code chip, trip toggle, and view switch
export function Header({
  groupName,
  code,
  members,
  vacationMode,
  view,
  onChangeView,
  onCopyCode,
  onRefresh,
  refreshing,
}: HeaderProps) {
  const countLabel = members.length === 1 ? "1 person" : `${members.length} people`;
  const tripLabel = vacationMode ? DASHBOARD_COPY.trip.statusLabel : null;

  return (
    <header className="space-y-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-muted">{countLabel} in this circle</p>
            {tripLabel && (
              <span className="px-2 py-0.5 rounded-full bg-sky border border-ink/40 text-[10px] font-semibold text-ink">
                {tripLabel}
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl leading-none text-ink mt-1">{groupName}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCopyCode}
            title="Tap to copy group code"
            className="px-3 py-1.5 rounded-full bg-card border-[1.5px] border-ink text-xs font-mono font-medium text-ink shadow-[2px_2px_0_0_var(--color-ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            #{code}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh group"
            title="Refresh"
            className="w-8 h-8 rounded-full bg-card border-[1.5px] border-ink flex items-center justify-center text-ink shadow-[2px_2px_0_0_var(--color-ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-60 cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center -space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {members.map((m) => (
            <span
              key={m.id}
              title={m.name}
              className="w-9 h-9 rounded-full bg-peach border-[1.5px] border-ink flex items-center justify-center text-base shrink-0"
            >
              {m.avatar || initials(m.name)}
            </span>
          ))}
        </div>

        <VacationToggle code={code} vacationMode={vacationMode} onToggled={onRefresh} />
      </div>

      <div className="flex justify-end">
        <div className="inline-flex bg-card p-1 rounded-full border-[1.5px] border-ink">
          {(["activity", "balances"] as DashboardView[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onChangeView(tab)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
                view === tab ? "bg-ink text-card" : "text-muted hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
