import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { paidBy, amount, note } = await req.json();

  if (!paidBy || !(Number(amount) > 0)) {
    return NextResponse.json({ error: "Who paid and a valid amount are required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: group } = await supabase.from("groups").select("id").eq("code", code).single();
  if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

  const { error } = await supabase
    .from("payments")
    .insert({ group_id: group.id, paid_by: paidBy, amount: Number(amount), note });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}