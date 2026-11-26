// Route 3: Get everything (this powers the whole dashboard)

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function calculateFairness(
  members: Array<{ id: string; name: string }>,
  payments: Array<Record<string, unknown>>,
) {
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const fairShare = members.length ? totalPaid / members.length : 0;

  return members.map((member) => {
    const paid = payments
      .filter((payment) => (payment.member_id ?? payment.payer_id ?? payment.paid_by) === member.id)
      .reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);

    return { memberId: member.id, name: member.name, paid, fairShare, balance: paid - fairShare };
  });
}

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
    .from("payments").select("*").eq("group_id", group.id).order("created_at");  // oldest first = timeline order

  const stats = calculateFairness(members ?? [], payments ?? []);

  return NextResponse.json({ group, members, payments, stats });
}

// PATCH: toggle Vacation Mode (F8)
export async function PATCH(req: Request, { params }: Ctx) {
  const { code } = await params;
  const { vacationMode } = await req.json();
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("groups").update({ vacation_mode: vacationMode }).eq("code", code);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}