import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { fromMember, toMember } = await req.json();
  const supabase = getSupabaseAdmin();

  const { data: group } = await supabase.from("groups").select("id").eq("code", code).single();
  if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

  const { error } = await supabase
    .from("nudges")
    .insert({ group_id: group.id, from_member: fromMember ?? null, to_member: toMember });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, message: "Gentle reminder sent 🕊️" });
}