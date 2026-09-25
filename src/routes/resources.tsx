import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  ALL_OPTION,
  FilterChoice,
  FilterDrawer,
} from "@/components/crm/filter-drawer";
import { SearchField } from "@/components/crm/search-field";
import { FilterSummary } from "@/components/crm/filter-summary";
import {
  countActiveFilters,
  matchesChoice,
  matchesSearch,
  uniqueValues,
} from "@/lib/filters";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
import { CreateFab } from "@/components/crm/create-fab";
import { PageHeader } from "@/components/crm/page-header";
import { RecordTable, type Column } from "@/components/crm/record-table";
import { StatusPill } from "@/components/crm/status-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResources } from "@/hooks/use-resources";
import type { Resource } from "@/types/crm";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — MediaOps CRM" },
      {
        name: "description",
        content:
          "Creative library of reels, carousels, templates and playbooks with owners, formats and approval status.",
      },
      { property: "og:title", content: "Resources — MediaOps CRM" },
      {
        property: "og:description",
        content: "Creative assets, templates and playbooks with approval status.",
      },
    ],
  }),
  component: ResourcesPage,
});

const columns: Column<Resource>[] = [
  {
    key: "title",
    header: "Asset",
    render: (row) => (
      <div>
        <p className="font-medium">{row.title}</p>
        <p className="text-xs text-muted-foreground">
          {row.id} · {row.format}
        </p>
      </div>
    ),
  },
  { key: "type", header: "Type", render: (row) => <Badge variant="secondary">{row.type}</Badge> },
  { key: "account", header: "Account", render: (row) => row.account, hideOnMobile: true },
  { key: "owner", header: "Owner", render: (row) => row.owner, hideOnMobile: true },
  { key: "status", header: "Status", render: (row) => <StatusPill value={row.status} /> },
  {
    key: "updated",
    header: "Updated",
    render: (row) => <span className="text-muted-foreground">{row.updated}</span>,
    hideOnMobile: true,
  },
];

function ResourcesPage() {
  const { resources, isLoading } = useResources();

  const [active, setActive] = useState<Resource | null>(null);

  // ---- Filters (shown in the right-hand drawer) ----
  const [search, setSearch] = useState("");
  const [type, setType] = useState(ALL_OPTION);
  const [status, setStatus] = useState(ALL_OPTION);
  const [accountName, setAccountName] = useState(ALL_OPTION);

  const accountNames = useMemo(() => uniqueValues(resources, (r) => r.account), [resources]);

  const visibleResources = useMemo(
    () =>
      resources.filter(
        (resource) =>
          matchesSearch(search, [
            resource.title,
            resource.id,
            resource.format,
            resource.owner,
            resource.account,
          ]) &&
          matchesChoice(type, resource.type) &&
          matchesChoice(status, resource.status) &&
          matchesChoice(accountName, resource.account),
      ),
    [resources, search, type, status, accountName],
  );

  const activeFilters = countActiveFilters([type, status, accountName]);

  const resetFilters = () => {
    setSearch("");
    setType(ALL_OPTION);
    setStatus(ALL_OPTION);
    setAccountName(ALL_OPTION);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Creative library"
        title="Resources"
        description="Every deliverable and reusable playbook. Open a row for format details and where it sits in review."
        actions={
          <>
            <SearchField value={search} onChange={setSearch} placeholder="Title, format or owner" />
            <FilterDrawer activeCount={activeFilters} onReset={resetFilters}>
              <FilterChoice
                label="Type"
                options={["Reel", "Carousel", "Static", "Video", "Template", "Playbook"]}
                value={type}
                onChange={setType}
              />
              <FilterChoice
                label="Status"
                options={["Draft", "In review", "Approved", "Published"]}
                value={status}
                onChange={setStatus}
              />
              <FilterChoice
                label="Account"
                options={accountNames}
                value={accountName}
                onChange={setAccountName}
              />
            </FilterDrawer>
            <Button asChild>
              <Link to="/resources/new">Upload asset</Link>
            </Button>
          </>
        }
      />

      <FilterSummary shown={visibleResources.length} total={resources.length} noun="assets" />

      <RecordTable
        rows={visibleResources}
        columns={columns}
        activeId={active?.id}
        onRowClick={setActive}
        empty={isLoading ? "Loading assets…" : "No assets match these filters."}
      />

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        title={active?.title ?? ""}
        subtitle={active ? `${active.type} · ${active.account}` : undefined}
        badge={active ? <StatusPill value={active.status} /> : null}
      >
        {active ? (
          <>
            <DetailGrid
              items={[
                { label: "Owner", value: active.owner },
                { label: "Format", value: active.format },
                { label: "Last updated", value: active.updated },
                { label: "Asset ID", value: active.id },
              ]}
            />

            <DetailSection title="Summary">
              <p className="text-muted-foreground">{active.summary}</p>
            </DetailSection>

            <DetailSection title="Review process">
              <ol className="space-y-2.5">
                {["Internal QC by the editor", "Account manager review", "Client sign-off", "Scheduled for publish"].map(
                  (step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ),
                )}
              </ol>
            </DetailSection>

            <div className="flex gap-2">
              <Button className="flex-1">Send for approval</Button>
              <Button variant="secondary" className="flex-1">
                Download
              </Button>
            </div>
          </>
        ) : null}
      </DetailSheet>
      <CreateFab to="/resources/new" label="Upload asset" />
    </div>
  );
}
