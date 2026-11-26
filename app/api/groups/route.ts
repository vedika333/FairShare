import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { groupName, yourName, avatar } = await req.json();
  const supabase = getSupabaseAdmin();

  if (!groupName || !yourName) {
    return NextResponse.json({ error: "Group name and your name are required" }, { status: 400 });
  }

  // Make a random 6-digit code. Retry if (very rarely) it already exists.
  let group = null;
  let lastError = "";
  for (let i = 0; i < 5 && !group; i++) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const { data, error } = await supabase
      .from("groups")
      .insert({ code, name: groupName })
      .select()
      .single();
    if (error) lastError = error.message;   // remember WHY it failed
    else group = data;
  }
  if (!group) {
    console.error("Group insert failed:", lastError);
    return NextResponse.json({ error: "Could not create group", reason: lastError }, { status: 500 });
  }
  // Add the creator as the first member
  const { data: member, error: memberErr } = await supabase
    .from("members")
    .insert({ group_id: group.id, name: yourName, avatar: avatar || "🌸" })
    .select()
    .single();
  if (memberErr) return NextResponse.json({ error: memberErr.message }, { status: 500 });

  // Frontend should save memberId in localStorage so we remember "who am I"
  return NextResponse.json({ code: group.code, memberId: member.id });
}