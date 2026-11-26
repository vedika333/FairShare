import type { Session } from "./types";

const SESSION_KEY = "fairshare:session";

// Read the saved "who am I" session from localStorage (safe during SSR or private mode)
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (typeof parsed.code === "string" && typeof parsed.memberId === "string") {
      return { code: parsed.code, memberId: parsed.memberId };
    }
    return null;
  } catch {
    return null;
  }
}

// Save which group and member this device belongs to
export function setSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage quota or privacy-mode errors
  }
}

// Forget the saved session on this device
export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore storage errors
  }
}
