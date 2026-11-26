// Seeds a demo group ("Canteen Crew") with 5 members and 8 uneven payments
// so the fairness ring starts in the "dramatic" state.
// Run with the Next.js dev server running: npm run seed

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${path} failed (${res.status}): ${data.error || "Unknown error"}`);
  }
  return data;
}

async function main() {
  const { code, memberId: aanyaId } = await post("/api/groups", {
    groupName: "Canteen Crew",
    yourName: "Aanya",
    avatar: "🌸",
  });

  const rohan = await post("/api/groups/join", { code, yourName: "Rohan", avatar: "🍵" });
  const meera = await post("/api/groups/join", { code, yourName: "Meera", avatar: "🦋" });
  const kabir = await post("/api/groups/join", { code, yourName: "Kabir", avatar: "🌙" });
  await post("/api/groups/join", { code, yourName: "Diya", avatar: "🍑" });

  // 8 uneven payments where Aanya covers most of the bills (score ~ 10, "dramatic")
  const payments = [
    { paidBy: aanyaId, amount: 1200, note: "Friday canteen feast" },
    { paidBy: rohan.memberId, amount: 150, note: "Masala chai round" },
    { paidBy: aanyaId, amount: 950, note: "Pizza & cold coffee" },
    { paidBy: meera.memberId, amount: 100, note: "Samosas" },
    { paidBy: aanyaId, amount: 800, note: "Late night Maggi & momos" },
    { paidBy: rohan.memberId, amount: 100, note: "Lemonade" },
    { paidBy: aanyaId, amount: 650, note: "Ice cream tubs" },
    { paidBy: kabir.memberId, amount: 50, note: "Mint candies" },
  ];

  for (const payment of payments) {
    await post(`/api/groups/${code}/payments`, payment);
  }

  console.log(`Seeded "Canteen Crew" (5 members, 8 payments).`);
  console.log(`Group code: ${code}`);
  console.log(`Open: ${BASE_URL}/g/${code}`);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
