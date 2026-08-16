import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DetailSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  badge,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string | undefined;
  badge?: ReactNode | undefined;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b bg-surface/60 px-6 py-5 pr-14 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-xl">{title}</SheetTitle>
              {subtitle ? <SheetDescription>{subtitle}</SheetDescription> : null}
            </div>
            {badge}
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-6 px-6 py-6">{children}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h3>
      <div className="mt-3 text-sm">{children}</div>
    </section>
  );
}

export function DetailGrid({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border bg-surface/50 px-3 py-2.5">
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="mt-0.5 text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
