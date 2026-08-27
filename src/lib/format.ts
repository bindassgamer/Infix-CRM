/** Shared display formatters. */

/** 4800 -> "$4,800" */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/** "Maya Iyer" -> "MI" */
export function formatInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}
