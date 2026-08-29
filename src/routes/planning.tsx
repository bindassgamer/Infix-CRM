import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
import { PageHeader } from "@/components/crm/page-header";
import { StatusPill } from "@/components/crm/status-pill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSchedule } from "@/hooks/use-schedule";
import type { ScheduleItem } from "@/types/crm";

export const Route = createFileRoute("/planning")({
  head: () => ({
    meta: [
      { title: "Planning — MediaOps CRM" },
      {
        name: "description",
        content:
          "Monthly content calendar for media uploads: publish slots, channels, owners and approval state.",
      },
      { property: "og:title", content: "Planning — MediaOps CRM" },
      {
        property: "og:description",
        content: "Calendar scheduling for media uploads across every client channel.",
      },
    ],
  }),
  component: PlanningPage,
});

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysInMonth = 31;
const startOffset = 5; // 1 Aug 2026 falls on a Saturday

function PlanningPage() {
  const [active, setActive] = useState<ScheduleItem | null>(null);
  const cells = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Scheduling"
        title="Planning"
        description="August 2026 upload calendar. Click any card to open the drop details and approval state."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Previous month">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-28 text-center text-sm font-medium">August 2026</span>
            <Button variant="outline" size="icon" aria-label="Next month">
              <ChevronRight className="size-4" />
            </Button>
            <Button>Schedule upload</Button>
          </div>
        }
      />

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-surface/60">
          {weekdays.map((d) => (
            <div
              key={d}
              className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const items = day ? schedule.filter((s) => s.day === day) : [];
            return (
              <div
                key={idx}
                className={cn(
                  "min-h-28 border-b border-r p-2 last:border-r-0",
                  !day && "bg-surface/40",
                )}
              >
                {day ? (
                  <>
                    <span className="text-xs font-medium text-muted-foreground">{day}</span>
                    <div className="mt-1.5 space-y-1.5">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActive(item)}
                          className="row-hover w-full rounded-md border border-primary/15 bg-primary/5 px-2 py-1.5 text-left hover:bg-primary/10"
                        >
                          <p className="truncate text-xs font-medium">{item.title}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {item.time} · {item.channel}
                          </p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel p-5">
        <h2 className="text-base font-semibold">Upload queue</h2>
        <ul className="mt-3 divide-y">
          {schedule.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActive(item)}
                className="row-hover flex w-full items-center gap-3 py-3 text-left hover:bg-surface/60"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/20 text-xs font-semibold text-accent-foreground">
                  {item.day}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.account} · {item.channel} · {item.time} · {item.owner}
                  </p>
                </div>
                <StatusPill value={item.status} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => {
          if (!o) setActive(null);
        }}
        title={active?.title ?? ""}
        subtitle={active ? `${active.account} · ${active.channel}` : undefined}
        badge={active ? <StatusPill value={active.status} /> : null}
      >
        {active ? (
          <>
            <DetailGrid
              items={[
                { label: "Publish date", value: `${active.day} Aug 2026` },
                { label: "Time slot", value: active.time },
                { label: "Channel", value: active.channel },
                { label: "Owner", value: active.owner },
              ]}
            />

            <DetailSection title="Plan">
              <p className="text-muted-foreground">
                Part of the {active.account} monthly content plan. Asset is cut for {active.channel}
                , captioned, and queued to auto-publish at {active.time} once approved.
              </p>
            </DetailSection>

            <DetailSection title="Process">
              <ol className="space-y-2.5">
                {[
                  "Brief locked and script approved",
                  "Edit delivered to review board",
                  "Client sign-off captured in-app",
                  "Automation publishes to the channel",
                  "Performance snapshot after 48 hours",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </DetailSection>

            <div className="flex gap-2">
              <Button className="flex-1">Approve & queue</Button>
              <Button variant="secondary" className="flex-1">
                Reschedule
              </Button>
            </div>
          </>
        ) : null}
      </DetailSheet>
    </div>
  );
}
