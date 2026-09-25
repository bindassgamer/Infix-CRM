import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

/**
 * Search box shown at the top right of every list page (next to the
 * Filters button). Search lives here — not inside the filter drawer — so it
 * is always one tap away on both phone and desktop.
 */
export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  label = "Search list",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-surface/70"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
