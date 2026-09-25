import { ALL_OPTION } from "@/components/crm/filter-drawer";

/**
 * Small helpers shared by the list pages so filtering logic stays
 * short and readable inside each page component.
 */

/** Sorted list of the distinct values a field holds across the rows. */
export function uniqueValues<T>(rows: T[], pick: (row: T) => string): string[] {
  return Array.from(new Set(rows.map(pick).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

/** True when the choice is "All" (no filter) or matches the row value. */
export function matchesChoice(choice: string, rowValue: string): boolean {
  return choice === ALL_OPTION || choice === rowValue;
}

/** Case-insensitive search across the given text fields. */
export function matchesSearch(query: string, fields: string[]): boolean {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  return fields.some((field) => field.toLowerCase().includes(term));
}

/**
 * How many drawer filters the user has actually set (used for the badge on the
 * Filters button). The search box lives in the page header, so it is not counted.
 */
export function countActiveFilters(choices: string[]): number {
  return choices.filter((choice) => choice !== ALL_OPTION).length;
}
