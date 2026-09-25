import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  ALL_OPTION,
  FilterChoice,
  FilterDrawer,
} from "@/components/crm/filter-drawer";
import { SearchField } from "@/components/crm/search-field";
import { FilterSummary } from "@/components/crm/filter-summary";
import { countActiveFilters, matchesChoice, matchesSearch, uniqueValues } from "@/lib/filters";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
import { CreateFab } from "@/components/crm/create-fab";
import { PageHeader } from "@/components/crm/page-header";
import { RecordTable, type Column } from "@/components/crm/record-table";
import { StatusPill } from "@/components/crm/status-pill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import { useLeads } from "@/hooks/use-leads";
import type { Lead, Stage } from "@/types/crm";

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

/** Stage choices in the drawer. "Open" means everything not won or lost. */
const stages = ["Open", "New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] as const;

function matchesStage(choice: string, stage: Stage): boolean {
  if (choice === ALL_OPTION) return true;
  if (choice === "Open") return stage !== "Won" && stage !== "Lost";
  return choice === stage;
}

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
    render: (row) => <span className="font-medium">{formatCurrency(row.value)}</span>,
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
  const { leads, isLoading } = useLeads();

  const [active, setActive] = useState<Lead | null>(null);

  // ---- Filters (shown in the right-hand drawer) ----
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState(ALL_OPTION);
  const [owner, setOwner] = useState(ALL_OPTION);
  const [source, setSource] = useState(ALL_OPTION);

  const owners = useMemo(() => uniqueValues(leads, (l) => l.owner), [leads]);
  const sources = useMemo(() => uniqueValues(leads, (l) => l.source), [leads]);

  const rows = useMemo(
    () =>
      leads.filter(
        (lead) =>
          matchesSearch(search, [lead.company, lead.name, lead.id, lead.source, lead.owner]) &&
          matchesStage(stage, lead.stage) &&
          matchesChoice(owner, lead.owner) &&
          matchesChoice(source, lead.source),
      ),
    [leads, search, stage, owner, source],
  );

  const activeFilters = countActiveFilters([stage, owner, source]);

  const resetFilters = () => {
    setSearch("");
    setStage(ALL_OPTION);
    setOwner(ALL_OPTION);
    setSource(ALL_OPTION);
  };

  const open = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        description={`${open.length} open leads worth ${formatCurrency(open.reduce((s, l) => s + l.value, 0))}. Click a row for the full story.`}
        actions={
          <>
            <SearchField value={search} onChange={setSearch} placeholder="Company, contact or source" />
            <FilterDrawer activeCount={activeFilters} onReset={resetFilters}>
              <FilterChoice label="Stage" options={stages} value={stage} onChange={setStage} />
              <FilterChoice label="Owner" options={owners} value={owner} onChange={setOwner} />
              <FilterChoice label="Source" options={sources} value={source} onChange={setSource} />
            </FilterDrawer>
            <Button asChild>
              <Link to="/leads/new">New lead</Link>
            </Button>
          </>
        }
      />

      <FilterSummary shown={rows.length} total={leads.length} noun="leads" />

      <RecordTable
        rows={rows}
        columns={columns}
        activeId={active?.id}
        onRowClick={setActive}
        empty={isLoading ? "Loading leads…" : "No leads match these filters."}
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
                { label: "Deal value", value: formatCurrency(active.value) },
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
      <CreateFab to="/leads/new" label="New lead" />
    </div>
  );
}
