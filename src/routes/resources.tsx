import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
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
  const [active, setActive] = useState<Resource | null>(null);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Creative library"
        title="Resources"
        description="Every deliverable and reusable playbook. Open a row for format details and where it sits in review."
        actions={<Button>Upload asset</Button>}
      />

      <RecordTable rows={resources} columns={columns} activeId={active?.id} onRowClick={setActive} />

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
    </div>
  );
}
