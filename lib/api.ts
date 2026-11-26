import type { GroupData } from "./types";

type AuthResponse = {
  code: string;
  memberId: string;
};

// Shared helper to read JSON and surface friendly server errors
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
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
