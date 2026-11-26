import type { GroupData } from "./types";

type AuthResponse = {
  code: string;
  memberId: string;
};

// Shared helper to read JSON and surface friendly server errors
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error("Couldn't reach the server, try again");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Something went wrong");
  }
  return data as T;
}

// Fetch the full group snapshot (group info, members, payments, fairness stats)
export function getGroup(code: string): Promise<GroupData> {
  return request<GroupData>(`/api/groups/${encodeURIComponent(code)}`, {
    cache: "no-store",
  });
}

// Create a new group and register the creator as its first member
export function createGroup(payload: {
  groupName: string;
  yourName: string;
  avatar: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Join an existing group using its 6-digit code
export function joinGroup(payload: {
  code: string;
  yourName: string;
  avatar: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/groups/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Record a new payment made by a member of the group
export function addPayment(
  code: string,
  payload: { paidBy: string; amount: number; note: string }
): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/api/groups/${encodeURIComponent(code)}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Send an anonymous gentle reminder nudge to the next payer
export function sendNudge(
  code: string,
  fromMember: string,
  toMember: string
): Promise<{ ok: boolean; message?: string }> {
  return request<{ ok: boolean; message?: string }>(
    `/api/groups/${encodeURIComponent(code)}/nudge`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromMember, toMember }),
    }
  );
}

// Toggle Trip (Vacation) mode on or off for the group
export function setVacationMode(
  code: string,
  on: boolean
): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/api/groups/${encodeURIComponent(code)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vacationMode: on }),
  });
}
