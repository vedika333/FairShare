import { NextResponse } from "next/server";
import { getSupabaseAdmin} from "@/lib/supabase";

export async function POST(req: Request) {
  const { code, yourName, avatar } = await req.json();
  const supabase = getSupabaseAdmin();
  // 1. Find the group by its code
  const { data: group } = await supabase.from("groups").select("id").eq("code", code).single();
  if (!group) return NextResponse.json({ error: "No group with that code 🥺" }, { status: 404 });

  // 2. Add the new member
  const { data: member, error } = await supabase
    .from("members")
    .insert({ group_id: group.id, name: yourName, avatar: avatar || "🌸" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ code, memberId: member.id });
}