import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { calculateFairness } from "@/lib/fairness";

type Ctx = { params: Promise<{ code: string }> };

// GET: one call returns group + members + payments + fairness numbers
export async function GET(_req: Request, { params }: Ctx) {
  const { code } = await params;
  const supabase = getSupabaseAdmin();

  const { data: group } = await supabase.from("groups").select("*").eq("code", code).single();
  if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

  const { data: members } = await supabase
    .from("members").select("id, name, avatar").eq("group_id", group.id).order("created_at");

  const { data: payments } = await supabase
    .from("payments").select("*").eq("group_id", group.id).order("created_at");

  const { data: nudges } = await supabase
    .from("nudges")
    .select("id, from_member, to_member, created_at")
    .eq("group_id", group.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = calculateFairness(members ?? [], payments ?? []);

  return NextResponse.json({
    group,
    members: members ?? [],
    payments: payments ?? [],
    nudges: nudges ?? [],
    stats,
  });
}

// PATCH: toggle Vacation Mode (F8)
export async function PATCH(req: Request, { params }: Ctx) {
  const { code } = await params;
  const supabase = getSupabaseAdmin();
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const { error } = await supabase
    .from("groups").update({ vacation_mode: body.vacationMode }).eq("code", code);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
