// Format a number in Hong Kong Dollars, dropping decimals for whole numbers
export function formatRupees(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const hasDecimals = rounded % 1 !== 0;
  return new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(rounded);
}

// Format an ISO timestamp into a short readable date like "26 Nov"
export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

// Extract up to two uppercase initials from a person's name
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
