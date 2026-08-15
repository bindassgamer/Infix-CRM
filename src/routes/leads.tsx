import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
import { PageHeader } from "@/components/crm/page-header";
import { RecordTable, type Column } from "@/components/crm/record-table";
import { StatusPill } from "@/components/crm/status-pill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currency, leads, type Lead, type Stage } from "@/data/crm";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads — MediaOps CRM" },
      {
        name: "description",
        content:
          "Track every lead by stage, value and owner, then open a lead to see the need, next step and full activity trail.",
      },
      { property: "og:title", content: "Leads — MediaOps CRM" },
      {
        property: "og:description",
        content: "Pipeline by stage with lead scores, next steps and activity trails.",
      },
    ],
  }),
  component: LeadsPage,
});

const filters = ["All", "Open", "New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] as const;

const columns: Column<Lead>[] = [
  {
    key: "name",
    header: "Lead",
    render: (row) => (
      <div>
        <p className="font-medium">{row.company}</p>
        <p className="text-xs text-muted-foreground">
          {row.name} · {row.source}
        </p>
      </div>
    ),
  },
  { key: "stage", header: "Stage", render: (row) => <StatusPill value={row.stage} /> },
  {
    key: "value",
    header: "Value",
    render: (row) => <span className="font-medium">{currency(row.value)}</span>,
  },
  {
    key: "score",
    header: "Score",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Progress value={row.score} className="h-1.5 w-16" />
        <span className="text-xs text-muted-foreground">{row.score}</span>
      </div>
    ),
    hideOnMobile: true,
  },
  { key: "owner", header: "Owner", render: (row) => row.owner, hideOnMobile: true },
  {
    key: "created",
    header: "Created",
    render: (row) => <span className="text-muted-foreground">{row.created}</span>,
    hideOnMobile: true,
  },
];

function LeadsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<Lead | null>(null);

  const rows = useMemo(() => {
    if (filter === "All") return leads;
    if (filter === "Open") return leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");
    return leads.filter((l) => l.stage === (filter as Stage));
  }, [filter]);

  const open = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        description={`${open.length} open leads worth ${currency(open.reduce((s, l) => s + l.value, 0))}. Click a row for the full story.`}
        actions={<Button>New lead</Button>}
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="flex-wrap">
          {filters.map((f) => (
            <TabsTrigger key={f} value={f}>
              {f}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <RecordTable
        rows={rows}
        columns={columns}
        activeId={active?.id}
        onRowClick={setActive}
        empty="No leads in this stage."
      />

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        title={active?.company ?? ""}
        subtitle={active ? `${active.name} · ${active.id}` : undefined}
        badge={active ? <StatusPill value={active.stage} /> : null}
      >
        {active ? (
          <>
            <DetailGrid
              items={[
                { label: "Deal value", value: currency(active.value) },
                { label: "Owner", value: active.owner },
                { label: "Source", value: active.source },
                { label: "Created", value: active.created },
              ]}
            />

            <DetailSection title="Lead score">
              <div className="flex items-center gap-3">
                <Progress value={active.score} className="h-2 flex-1" />
                <span className="text-sm font-medium">{active.score}/100</span>
              </div>
            </DetailSection>

            <DetailSection title="What they need">
              <p className="text-muted-foreground">{active.need}</p>
            </DetailSection>

            <DetailSection title="Next step">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                {active.nextStep}
              </div>
            </DetailSection>

            <DetailSection title="Activity">
              <ol className="relative space-y-4 border-l pl-5">
                {active.timeline.map((t) => (
                  <li key={t.date + t.event} className="relative">
                    <span className="absolute -left-[1.5625rem] top-1.5 size-2 rounded-full bg-primary" />
                    <p className="text-sm font-medium">{t.event}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </li>
                ))}
              </ol>
            </DetailSection>

            <div className="flex gap-2">
              <Button className="flex-1">Advance stage</Button>
              <Button variant="secondary" className="flex-1">
                Log activity
              </Button>
            </div>
          </>
        ) : null}
      </DetailSheet>
    </div>
  );
}
