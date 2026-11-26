type Member = { id: string; name: string; avatar: string };
type Payment = { paid_by: string; amount: number };

export function calculateFairness(members: Member[], payments: Payment[]) {
  const totalSpend = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const fairShare = members.length > 0 ? totalSpend / members.length : 0;

  const balances = members.map((m) => {
    const paid = payments
      .filter((p) => p.paid_by === m.id)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return { ...m, paid, net: round(paid - fairShare) };
  });

  let score = 100;
  if (totalSpend > 0 && balances.length > 0) {
    const nets = balances.map((b) => b.net);
    const spread = Math.max(...nets) - Math.min(...nets);
    score = Math.round(100 - (spread / totalSpend) * 100);
  }
  score = Math.max(0, Math.min(100, score));

  const mood = score >= 75 ? "calm" : score >= 40 ? "tense" : "dramatic";

  const sorted = [...balances].sort((a, b) => a.net - b.net);
  const nextPayer = balances.length > 0 ? sorted[0] : null;

  return { totalSpend: round(totalSpend), fairShare: round(fairShare), score, mood, balances, nextPayer };
}

const round = (n: number) => Math.round(n * 100) / 100;