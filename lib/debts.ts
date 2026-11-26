import type { Balance, Transfer } from "./types";

// Round to 2 decimal places so floating-point math doesn't leave tiny fractions
const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Turns everyone's net standing into the fewest possible "A -> B" transfers.
 * net < 0 means a member is behind (sends money); net > 0 means ahead (receives money).
 * Why greedy: repeatedly matching the most-behind member with the most-ahead member
 * clears one person's standing each step and keeps the transfer list short.
 */
export function evenUp(balances: Balance[]): Transfer[] {
  // Split into people who are behind (negative net) and people who are ahead (positive net).
  // Ignore amounts under HK$1 so nobody is asked to transfer paise.
  const behind = balances
    .filter((b) => b.net <= -1)
    .map((b) => ({ member: b, remaining: round(-b.net) }));

  const ahead = balances
    .filter((b) => b.net >= 1)
    .map((b) => ({ member: b, remaining: round(b.net) }));

  const transfers: Transfer[] = [];

  // Keep matching until either side has nobody left with at least HK$1 to even up
  while (behind.length > 0 && ahead.length > 0) {
    // Pick the most-behind person and the most-ahead person right now
    behind.sort((a, b) => b.remaining - a.remaining);
    ahead.sort((a, b) => b.remaining - a.remaining);

    const mostBehind = behind[0];
    const mostAhead = ahead[0];

    // Transfer the smaller of what the sender is behind and what the receiver is ahead
    const amount = round(Math.min(mostBehind.remaining, mostAhead.remaining));

    if (amount >= 1) {
      transfers.push({
        from: mostBehind.member,
        to: mostAhead.member,
        amount,
      });
    }

    // Subtract the matched amount from both sides
    mostBehind.remaining = round(mostBehind.remaining - amount);
    mostAhead.remaining = round(mostAhead.remaining - amount);

    // Drop anyone whose remaining amount is now under HK$1
    if (mostBehind.remaining < 1) behind.shift();
    if (mostAhead.remaining < 1) ahead.shift();
  }

  return transfers;
}
