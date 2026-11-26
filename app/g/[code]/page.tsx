"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getGroup } from "@/lib/api";
import { getSession, setSession } from "@/lib/session";
import type { GroupData } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { Header, type DashboardView } from "@/components/dashboard/Header";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { ExpenseFeed } from "@/components/dashboard/ExpenseFeed";
import { WhoAreYouCard } from "@/components/dashboard/WhoAreYouCard";

// Read-only group dashboard: loads group data, tracks the active member, and switches views
export default function DashboardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [data, setData] = useState<GroupData | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [view, setView] = useState<DashboardView>("activity");
  const [toast, setToast] = useState<string | null>(null);

  const loadGroup = useCallback(async () => {
    setRefreshing(true);
    try {
      const next = await getGroup(code);
      setData(next);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load group");
    } finally {
      setRefreshing(false);
    }
  }, [code]);

  // Load saved member session and fetch group data on mount + window focus
  useEffect(() => {
    const saved = getSession();
    setMemberId(saved?.code === code ? saved.memberId : null);
    loadGroup();

    window.addEventListener("focus", loadGroup);
    return () => window.removeEventListener("focus", loadGroup);
  }, [code, loadGroup]);

  function handlePickMember(id: string) {
    setSession({ code, memberId: id });
    setMemberId(id);
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setToast(`Copied code #${code}`);
    } catch {
      setToast(`Group code: #${code}`);
    }
  }

  if (error) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 text-center gap-3">
        <p className="font-display italic text-3xl text-rose">{error}</p>
        <Link href="/" className="text-sm underline text-muted hover:text-ink">
          Back home
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4">
        <p className="font-display italic text-2xl text-muted">opening your diary…</p>
      </main>
    );
  }

  const knownMember = Boolean(memberId && data.members.some((m) => m.id === memberId));

  return (
    <main className="min-h-dvh px-4 py-6 max-w-[420px] mx-auto space-y-5">
      <Header
        groupName={data.group.name}
        code={data.group.code}
        members={data.members}
        view={view}
        onChangeView={setView}
        onCopyCode={handleCopyCode}
        onRefresh={loadGroup}
        refreshing={refreshing}
      />

      {!knownMember ? (
        <WhoAreYouCard
          groupName={data.group.name}
          members={data.members}
          onPickMember={handlePickMember}
        />
      ) : (
        <>
          <HeroCard stats={data.stats} currentMemberId={memberId} />

          {view === "activity" ? (
            <ExpenseFeed payments={data.payments} members={data.members} />
          ) : (
            <Card className="text-center py-8">
              <h2 className="font-display text-2xl text-ink">Balances</h2>
              <p className="text-sm text-muted mt-1.5">
                Detailed per-person balances and gentle nudges are coming next.
              </p>
            </Card>
          )}
        </>
      )}

      <Toast message={toast} onDone={() => setToast(null)} />
    </main>
  );
}
