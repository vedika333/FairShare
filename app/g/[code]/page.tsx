"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getGroup } from "@/lib/api";
import { getSession, setSession } from "@/lib/session";
import type { GroupData, Payment, Transfer } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Header, type DashboardView } from "@/components/dashboard/Header";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { ExpenseFeed } from "@/components/dashboard/ExpenseFeed";
import { WhoAreYouCard } from "@/components/dashboard/WhoAreYouCard";
import { BalancesView } from "@/components/balances/BalancesView";
import { SettleSheet } from "@/components/balances/SettleSheet";
import { AddPaymentSheet } from "@/components/sheets/AddPaymentSheet";
import { PaymentDetailSheet } from "@/components/sheets/PaymentDetailSheet";

// Group dashboard: wires together Activity, Balances, and the payment/settle sheets
export default function DashboardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [data, setData] = useState<GroupData | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [view, setView] = useState<DashboardView>("activity");
  const [toast, setToast] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [settleTransfer, setSettleTransfer] = useState<Transfer | null>(null);

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

  async function handlePaymentAdded() {
    await loadGroup();
    setToast("Payment added");
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
    <main className="min-h-dvh px-4 pt-6 pb-24 max-w-[420px] mx-auto space-y-5">
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
            <ExpenseFeed
              payments={data.payments}
              members={data.members}
              onSelectPayment={setSelectedPayment}
            />
          ) : (
            <BalancesView
              balances={data.stats.balances}
              currentMemberId={memberId}
              onSettle={setSettleTransfer}
            />
          )}

          {/* Floating bottom-right action button */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-4 flex justify-end pointer-events-none z-30">
            <Button
              variant="rose"
              onClick={() => setAddOpen(true)}
              className="pointer-events-auto"
            >
              + Add Payment
            </Button>
          </div>
        </>
      )}

      <AddPaymentSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        code={code}
        members={data.members}
        currentMemberId={memberId}
        onAdded={handlePaymentAdded}
      />

      <PaymentDetailSheet
        payment={selectedPayment}
        members={data.members}
        onClose={() => setSelectedPayment(null)}
      />

      <SettleSheet
        transfer={settleTransfer}
        onClose={() => setSettleTransfer(null)}
        onConfirmDemo={() => setToast("Marked as paid (demo)")}
      />

      <Toast message={toast} onDone={() => setToast(null)} />
    </main>
  );
}
