"use client";

import { useState } from "react";
import type { Member } from "@/lib/types";
import { addPayment } from "@/lib/api";
import { initials } from "@/lib/format";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

type AddPaymentSheetProps = {
  open: boolean;
  onClose: () => void;
  code: string;
  members: Member[];
  currentMemberId: string | null;
  onAdded: () => Promise<void> | void;
};

const PRESETS = [200, 500, 1000];

// Bottom sheet for logging a new shared payment with preset rupee chips
export function AddPaymentSheet({
  open,
  onClose,
  code,
  members,
  currentMemberId,
  onAdded,
}: AddPaymentSheetProps) {
  const [paidBy, setPaidBy] = useState(currentMemberId ?? members[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedMember = members.find((m) => m.id === paidBy) ?? members[0];
  const payerName = selectedMember?.name ?? "Someone";

  function addPreset(value: number) {
    const current = Number(amount) || 0;
    setAmount(String(current + value));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!paidBy) {
      setError("Pick who paid.");
      return;
    }
    if (!(numericAmount > 0)) {
      setError("Enter an amount greater than HK$0.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await addPayment(code, { paidBy, amount: numericAmount, note: note.trim() });
      onClose();
      await onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Add a payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted mb-2">Who covered it?</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {members.map((m) => {
              const selected = m.id === paidBy;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaidBy(m.id)}
                  className={`flex items-center gap-1.5 min-h-11 px-3.5 py-2 rounded-full border-[1.5px] text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selected
                      ? "bg-peach border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
                      : "bg-paper border-ink/20 text-muted hover:border-ink/50"
                  }`}
                >
                  <span>{m.avatar || initials(m.name)}</span>
                  <span className="text-ink">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 bg-paper border-[1.5px] border-ink rounded-2xl px-4 py-3">
            <span className="font-mono text-2xl text-muted">HK$</span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              min="1"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className="w-full bg-transparent font-mono text-3xl font-semibold text-ink placeholder:text-muted/40 outline-none"
            />
          </div>

          <div className="flex gap-2 mt-2.5">
            {PRESETS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => addPreset(value)}
                className="min-h-11 px-3.5 py-2 rounded-full bg-paper border-[1.5px] border-ink/25 hover:border-ink text-xs font-mono font-medium text-ink transition-colors cursor-pointer"
              >
                +{value}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          maxLength={42}
          placeholder="What was it for? (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-paper border-[1.5px] border-ink/25 focus:border-rose rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none transition-colors"
        />

        {error && <p className="text-xs font-medium text-rose">{error}</p>}

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Saving…" : `${payerName} paid 💖`}
        </Button>
      </form>
    </Sheet>
  );
}
