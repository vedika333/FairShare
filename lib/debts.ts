import type { Balance, Transfer } from "./types";

// Round to 2 decimal places so floating-point math doesn't leave tiny fractions
const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Turns everyone's net balance into the fewest possible "A pays B" transfers.
 * Why greedy: matching the biggest debtor with the biggest creditor at each step
 * clears one person's debt completely and keeps the list short for friends.
 */
export function simplifyDebts(balances: Balance[]): Transfer[] {
  // Split members into people who owe money (negative net) and people who are owed (positive net).
  // Ignore tiny amounts under ₹1 so nobody gets asked to transfer paise.
  const debtors = balances
    .filter((b) => b.net <= -1)
    .map((b) => ({ member: b, remaining: round(-b.net) }));

  const creditors = balances
    .filter((b) => b.net >= 1)
    .map((b) => ({ member: b, remaining: round(b.net) }));

  const transfers: Transfer[] = [];

  // Keep matching until either side has nobody left with at least ₹1 to settle
  while (debtors.length > 0 && creditors.length > 0) {
    // Pick the person who owes the most and the person owed the most right now
    debtors.sort((a, b) => b.remaining - a.remaining);
    creditors.sort((a, b) => b.remaining - a.remaining);

    const topDebtor = debtors[0];
    const topCreditor = creditors[0];

    // The transfer amount is the smaller of what the debtor owes and what the creditor is owed
    const amount = round(Math.min(topDebtor.remaining, topCreditor.remaining));

    if (amount >= 1) {
      transfers.push({
        from: topDebtor.member,
        to: topCreditor.member,
        amount,
      });
    }

    // Subtract the settled amount from both sides
    topDebtor.remaining = round(topDebtor.remaining - amount);
    topCreditor.remaining = round(topCreditor.remaining - amount);

    // Drop anyone whose remaining balance is now under ₹1
    if (topDebtor.remaining < 1) debtors.shift();
    if (topCreditor.remaining < 1) creditors.shift();
  }

  return transfers;
}
