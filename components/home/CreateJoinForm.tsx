"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createGroup, joinGroup } from "@/lib/api";
import { HOME_COPY } from "@/lib/copy";
import { getSession, setSession } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const AVATARS = ["🌸", "🐰", "🍑", "🦋", "🍵", "🌙"];
type Mode = "create" | "join";

const subscribe = () => () => {};
const getSavedCodeSnapshot = () => getSession()?.code ?? null;
const getServerSnapshot = () => null;

const inputClass =
  "w-full bg-paper/70 border-[1.5px] border-ink/25 focus:border-rose rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none transition-colors";

// Form card for starting a new group or joining an existing one with a 6-digit code
export function CreateJoinForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("create");
  const [yourName, setYourName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [code, setCode] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const savedCode = useSyncExternalStore(subscribe, getSavedCodeSnapshot, getServerSnapshot);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data =
        mode === "create"
          ? await createGroup({ groupName, yourName, avatar })
          : await joinGroup({ code, yourName, avatar });

      setSession({ code: data.code, memberId: data.memberId });
      router.push(`/g/${data.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the server. Try again?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <p className="text-xs font-semibold uppercase tracking-widest text-rose">
          fairshare {HOME_COPY.logoEmoji}
        </p>
        <h1 className="font-display text-4xl leading-[1.05] mt-1.5 text-ink">
          Nobody has to be the bad guy.
        </h1>
        <p className="text-sm text-muted mt-2">{HOME_COPY.pitch}</p>

        {/* Create / Join toggle */}
        <div className="grid grid-cols-2 gap-1.5 bg-paper p-1 rounded-full border-[1.5px] border-ink/20 mt-6">
          {(["create", "join"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`min-h-11 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === m
                  ? "bg-ink text-card shadow-[1px_1px_0_0_var(--color-rose)]"
                  : "text-muted hover:text-ink"
              }`}
            >
              {m === "create" ? "Start a group" : "I have a code"}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3.5">
          {mode === "create" ? (
            <input
              className={inputClass}
              placeholder="Group name (e.g. Hostel Besties)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          ) : (
            <input
              className={`${inputClass} font-mono tracking-[0.35em] text-center`}
              placeholder="6-digit code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
            />
          )}
          <input
            className={inputClass}
            placeholder="Your name"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            required
          />
        </div>

        <p className="text-xs font-medium text-muted mt-5 mb-2">Pick your little face</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`h-11 rounded-full text-lg flex items-center justify-center border-[1.5px] transition-all cursor-pointer ${
                avatar === a
                  ? "bg-peach border-ink scale-105 shadow-[2px_2px_0_0_var(--color-ink)]"
                  : "bg-paper border-ink/15 hover:border-ink/40"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {error && <p className="text-xs font-medium text-rose mt-4">{error}</p>}

        <Button type="submit" disabled={busy} className="mt-6 w-full">
          {busy ? "One moment…" : mode === "create" ? "Create our group" : "Join the group"}
        </Button>

        {savedCode && (
          <Link
            href={`/g/${savedCode}`}
            className="min-h-11 flex items-center justify-center text-xs font-medium text-muted mt-3 hover:text-rose transition-colors"
          >
            Back to group <span className="font-mono ml-1">{savedCode}</span> →
          </Link>
        )}
      </form>
    </Card>
  );
}
