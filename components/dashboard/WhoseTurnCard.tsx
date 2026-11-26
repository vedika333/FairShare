"use client";

import { useState } from "react";
import type { Balance } from "@/lib/types";
import { sendNudge } from "@/lib/api";
import {
  TOAST_COPY,
  TURN_COPY,
  TURN_FOOD_EMOJIS,
  WHOSE_TURN_LINES,
} from "@/lib/copy";
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

// Tilted spotlight card showing whose turn it is next, with an anonymous reminder button
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
        <p className="font-display italic text-xl text-ink">{TURN_COPY.emptyState}</p>
      </Card>
    );
  }

  const isMe = nextPayer.id === currentMemberId;
  const foodEmoji = TURN_FOOD_EMOJIS[paymentCount % TURN_FOOD_EMOJIS.length];
  const funnyLine = WHOSE_TURN_LINES[paymentCount % WHOSE_TURN_LINES.length];

  async function handleNudge() {
    if (!currentMemberId || !nextPayer || sending || sentThisSession) return;
    setSending(true);
    try {
      await sendNudge(code, currentMemberId, nextPayer.id);
      setSentThisSession(true);
      onNudgeSent(TOAST_COPY.nudgeSent);
    } catch (err) {
      onNudgeSent(
        err instanceof Error ? err.message : "Couldn't reach the server, try again"
      );
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
            {isMe ? "It's your turn" : `${nextPayer.name}'s turn ${foodEmoji}`}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {isMe ? TURN_COPY.yourTurnLine : funnyLine}
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
            ? TURN_COPY.nudgeButtonSent
            : sending
              ? "Sending…"
              : TURN_COPY.nudgeButton}
        </button>
      )}
    </Card>
  );
}
