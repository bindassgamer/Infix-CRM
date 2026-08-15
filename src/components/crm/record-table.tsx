import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
};

export function RecordTable<T extends { id: string }>({
  rows,
  columns,
  onRowClick,
  activeId,
  empty = "Nothing here yet.",
}: {
  rows: T[];
  columns: Column<T>[];
  onRowClick: (row: T) => void;
  activeId?: string | null;
  empty?: string;
}) {
  return (
    <div className="panel overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface/60 hover:bg-surface/60">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "h-11 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                  col.hideOnMobile && "hidden md:table-cell",
                  col.className,
                )}
              >
                {col.header}
              </TableHead>
            ))}
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                tabIndex={0}
                role="button"
                onClick={() => onRowClick(row)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
                className={cn(
                  "row-hover group cursor-pointer border-border/70 outline-none focus-visible:bg-accent/10",
                  activeId === row.id && "bg-primary/5",
                )}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "py-3.5 text-sm",
                      col.hideOnMobile && "hidden md:table-cell",
                      col.className,
                    )}
                  >
                    {col.render(row)}
                  </TableCell>
                ))}
                <TableCell className="py-3.5 text-right">
                  <ChevronRight className="ml-auto size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
