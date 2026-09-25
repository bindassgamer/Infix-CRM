import type { ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Reusable filter drawer shared by every list page (accounts, contacts,
 * leads, resources). It opens from the right and holds `FilterGroup` blocks.
 *
 * Usage:
 * Free-text search is NOT in here: each list page renders <SearchField /> in its
 * header so search is always visible.
 *
 * Usage:
 *   <FilterDrawer activeCount={2} onReset={resetFilters}>
 *     <FilterChoice label="Owner" ... />
 *   </FilterDrawer>
 */
export function FilterDrawer({
  activeCount,
  onReset,
  children,
  title = "Filters",
}: {
  activeCount: number;
  onReset: () => void;
  children: ReactNode;
  title?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 ? (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="shrink-0 border-b bg-surface/60 px-4 py-4 pr-14 text-left sm:px-6">
          <SheetTitle className="text-lg">{title}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="min-h-0 w-full flex-1 [&>div>div]:!block">
          <div className="space-y-6 px-4 py-5 sm:px-6">{children}</div>
        </ScrollArea>

        <div className="shrink-0 border-t bg-surface/60 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <Button variant="secondary" className="w-full gap-2" onClick={onReset}>
            <X className="size-4" />
            Clear all filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** One labelled block inside the drawer. */
export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

/**
 * Single-select chip list. `ALL_OPTION` is always shown first and means
 * "no filter on this field".
 */
export const ALL_OPTION = "All";

export function FilterChoice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FilterGroup label={label}>
      <div className="flex flex-wrap gap-2">
        {[ALL_OPTION, ...options].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              option === value
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "bg-card text-muted-foreground hover:bg-surface/70",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </FilterGroup>
  );
}
