"use client";

import { useState } from "react";
import type { Balance } from "@/lib/types";
import { sendNudge } from "@/lib/api";
import { initials } from "@/lib/format";
import { Card } from "@/components/ui/Card";

type WhoseTurnCardProps = {
  code: string;
  nextPayer: Balance | null;
  hasPayments: boolean;
  paymentCount: number;
  currentMemberId: string | null;
  onNudgeSent: (message: string) => void;
};

const FUNNY_LINES = [
  "they've been freeloading (lovingly)",
  "the wallet has been resting long enough",
  "a gentle hint from the universe",
];

// Tilted spotlight card showing whose turn it is to pay next, with an anonymous nudge button
export function WhoseTurnCard({
  code,
  nextPayer,
  hasPayments,
  paymentCount,
  currentMemberId,
  onNudgeSent,
}: WhoseTurnCardProps) {
  const [sending, setSending] = useState(false);
  const [sentThisSession, setSentThisSession] = useState(false);

  if (!hasPayments || !nextPayer) {
    return (
      <Card className="text-center py-5 bg-peach/30">
        <p className="font-display italic text-xl text-ink">
          Nobody has paid yet. Be the first hero.
        </p>
      </Card>
    );
  }

  const isMe = nextPayer.id === currentMemberId;
  const line = FUNNY_LINES[paymentCount % FUNNY_LINES.length];

  async function handleNudge() {
    if (!currentMemberId || !nextPayer || sending || sentThisSession) return;
    setSending(true);
    try {
      await sendNudge(code, currentMemberId, nextPayer.id);
      setSentThisSession(true);
      onNudgeSent("Reminder sent. Nobody will know it was you");
    } catch (err) {
      onNudgeSent(err instanceof Error ? err.message : "Could not send reminder");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="-rotate-1">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-peach border-[1.5px] border-ink flex items-center justify-center text-3xl shrink-0 shadow-[2px_2px_0_0_var(--color-ink)]">
          {nextPayer.avatar || initials(nextPayer.name)}
        </div>

        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-tight text-ink">
            {isMe ? "It's your turn" : `${nextPayer.name}'s turn`}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {isMe ? "you're up next when the next bill lands" : line}
          </p>
        </div>
      </div>

      {!isMe && currentMemberId && (
        <button
          type="button"
          onClick={handleNudge}
          disabled={sending || sentThisSession}
          className="mt-4 w-full min-h-11 py-2.5 px-4 rounded-full bg-lilac text-ink text-xs font-semibold border-[1.5px] border-ink shadow-[2px_2px_0_0_var(--color-ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-55 disabled:pointer-events-none cursor-pointer"
        >
          {sentThisSession
            ? "Gentle reminder sent"
            : sending
              ? "Sending…"
              : "Send a gentle reminder"}
        </button>
      )}
    </Card>
  );
}
