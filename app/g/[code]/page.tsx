"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getGroup } from "@/lib/api";
import { EVEN_UP_COPY, TOAST_COPY } from "@/lib/copy";
import { getSession, setSession } from "@/lib/session";
import type { GroupData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { Header, type DashboardView } from "@/components/dashboard/Header";
import { NudgeBanner } from "@/components/dashboard/NudgeBanner";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { WhoseTurnCard } from "@/components/dashboard/WhoseTurnCard";
import { RotationLog } from "@/components/dashboard/RotationLog";
import { WhoAreYouCard } from "@/components/dashboard/WhoAreYouCard";

// Group dashboard: loads group data and renders Header, NudgeBanner, HeroCard, WhoseTurnCard, RotationLog
export default function DashboardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [data, setData] = useState<GroupData | null>(null);
  const [loadedAt, setLoadedAt] = useState(0);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [view, setView] = useState<DashboardView>("rotation");
  const [toast, setToast] = useState<string | null>(null);

  const loadGroup = useCallback(async () => {
    setRefreshing(true);
    try {
      const next = await getGroup(code);
      const saved = getSession();
      setMemberId(saved?.code === code ? saved.memberId : null);
      setData(next);
      setLoadedAt(Date.now());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the server, try again");
    } finally {
      setRefreshing(false);
    }
  }, [code]);

  // Fetch group data on mount and whenever the window regains focus
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadGroup();
    }, 0);
    window.addEventListener("focus", loadGroup);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", loadGroup);
    };
  }, [loadGroup]);

  function handlePickMember(id: string) {
    setSession({ code, memberId: id });
    setMemberId(id);
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setToast(TOAST_COPY.codeCopied(code));
    } catch {
      setToast(`Group code: #${code}`);
    }
  }

  if (error) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 text-center gap-4">
        <p className="font-display italic text-3xl text-rose">{error}</p>
        <div className="flex items-center gap-3">
          <Button variant="soft" onClick={loadGroup}>
            Try again
          </Button>
          <Link
            href="/"
            className="min-h-11 inline-flex items-center px-4 text-sm underline text-muted hover:text-ink"
          >
            Back home
          </Link>
        </div>
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
    <main className="min-h-dvh px-4 pt-6 pb-12 max-w-[420px] mx-auto space-y-5">
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
      ) : view === "even-up" ? (
        <Card className="text-center py-8">
          <h2 className="font-display text-2xl text-ink">{EVEN_UP_COPY.title}</h2>
          <p className="text-sm text-muted mt-1.5">{EVEN_UP_COPY.placeholder}</p>
        </Card>
      ) : (
        <>
          <NudgeBanner
            nudges={data.nudges ?? []}
            currentMemberId={memberId}
            now={loadedAt}
          />

          <HeroCard
            stats={data.stats}
            payments={data.payments}
            currentMemberId={memberId}
          />

          <WhoseTurnCard
            code={code}
            nextPayer={data.stats.nextPayer}
            hasPayments={data.payments.length > 0}
            paymentCount={data.payments.length}
            currentMemberId={memberId}
            onNudgeSent={setToast}
          />

          <RotationLog payments={data.payments} members={data.members} />
        </>
      )}

      <Toast message={toast} onDone={() => setToast(null)} />
    </main>
  );
}
