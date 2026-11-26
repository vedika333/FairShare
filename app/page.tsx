"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const subscribe = () => () => {};
function getSavedCode(): string | null {
    try {
        const s = localStorage.getItem("fairshare:session");
        return s ? JSON.parse(s).code ?? null : null;
    } catch {
        return null;
    }
}
const getServerSnapshot = () => null;

const AVATARS = ["🌸", "🐰", "🍑", "🦋", "🍵", "🌙"];
type Mode = "create" | "join";

const field =
    "w-full bg-transparent border-b-2 border-ink/20 focus:border-rose outline-none py-2 text-lg placeholder:text-ink-soft/50 transition-colors";

export default function Home() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("create");
    const [yourName, setYourName] = useState("");
    const [groupName, setGroupName] = useState("");
    const [code, setCode] = useState("");
    const [avatar, setAvatar] = useState(AVATARS[0]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    // If this device already joined a group, offer a shortcut back
    const savedCode = useSyncExternalStore(subscribe, getSavedCode, getServerSnapshot);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            const url = mode === "create" ? "/api/groups" : "/api/groups/join";
            const body = mode === "create" ? { groupName, yourName, avatar } : { code, yourName, avatar };
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Something went wrong");
                return;
            }
            // remember "who am I" on this device (no login needed)
            localStorage.setItem("fairshare:session", JSON.stringify({ code: data.code, memberId: data.memberId }));
            router.push(`/g/${data.code}`);
        } catch {
            setError("Couldn't reach the server. Try again?");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="min-h-dvh flex items-center justify-center p-5">
            <div className="relative w-full max-w-sm">
                {/* washi tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-3 w-28 h-7 bg-lilac/80 z-10" />

                <form
                    onSubmit={submit}
                    className="relative bg-card rounded-[28px] border border-ink/10 px-7 pt-10 pb-8 -rotate-1
                     shadow-[7px_7px_0_0_rgba(226,125,138,0.22)]"
                >
                    <p className="font-hand text-2xl text-rose leading-none">fairshare</p>
                    <h1 className="font-display text-[2rem] leading-[1.1] mt-2 italic">
                        Nobody has to be the bad guy.
                    </h1>
                    <p className="text-sm text-ink-soft mt-3">
                        A gentle way to keep &ldquo;who pays this time?&rdquo; fair for everyone.
                    </p>

                    {/* mode switch: plain text, not pills */}
                    <div className="flex gap-5 mt-7 text-sm font-medium">
                        {(["create", "join"] as Mode[]).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => { setMode(m); setError(""); }}
                                className={`pb-1 border-b-2 transition-colors ${mode === m ? "border-rose text-ink" : "border-transparent text-ink-soft"
                                    }`}
                            >
                                {m === "create" ? "Start a group" : "I have a code"}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 space-y-5">
                        {mode === "create" ? (
                            <input className={field} placeholder="Group name (Hostel Besties)"
                                value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
                        ) : (
                            <input className={`${field} tracking-[0.4em] font-display`} placeholder="6-digit code"
                                inputMode="numeric" maxLength={6}
                                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} required />
                        )}
                        <input className={field} placeholder="Your name"
                            value={yourName} onChange={(e) => setYourName(e.target.value)} required />
                    </div>

                    <p className="font-hand text-xl text-ink-soft mt-6">pick your little face</p>
                    <div className="flex gap-2 mt-1">
                        {AVATARS.map((a) => (
                            <button
                                key={a}
                                type="button"
                                onClick={() => setAvatar(a)}
                                className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${avatar === a ? "bg-peach ring-2 ring-rose scale-110" : "bg-peach/40"
                                    }`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>

                    {error && <p className="font-hand text-xl text-rose mt-4">{error}</p>}

                    <button
                        type="submit"
                        disabled={busy}
                        className="mt-7 w-full py-3 rounded-full bg-rose text-white font-semibold border-2 border-ink
                       shadow-[3px_3px_0_0_#4a3a3f] active:translate-x-[2px] active:translate-y-[2px]
                       active:shadow-none transition-all disabled:opacity-60"
                    >
                        {busy ? "One moment…" : mode === "create" ? "Create our group" : "Join the group"}
                    </button>

                    {savedCode && (
                        <Link href={`/g/${savedCode}`} className="block text-center font-hand text-xl text-ink-soft mt-5 hover:text-rose">
                            back to group {savedCode} →
                        </Link>
                    )}
                </form>
            </div>
        </main>
    );
}