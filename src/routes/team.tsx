import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
import { CreateFab } from "@/components/crm/create-fab";
import { PageHeader } from "@/components/crm/page-header";
import { RecordTable, type Column } from "@/components/crm/record-table";
import { StatusPill } from "@/components/crm/status-pill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAccounts } from "@/hooks/use-accounts";
import { useResources } from "@/hooks/use-resources";
import { useTeam } from "@/hooks/use-team";
import type { Member } from "@/types/crm";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — MediaOps CRM" },
      {
        name: "description",
        content:
          "Studio roster with capacity, account load and focus areas so you can staff work without overbooking anyone.",
      },
      { property: "og:title", content: "Team — MediaOps CRM" },
      { property: "og:description", content: "Roster, capacity and account load for the studio." },
    ],
  }),
  component: TeamPage,
});

const columns: Column<Member>[] = [
  {
    key: "name",
    header: "Member",
    render: (row) => (
      <div>
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.role}</p>
      </div>
    ),
  },
  { key: "focus", header: "Focus", render: (row) => row.focus, hideOnMobile: true },
  {
    key: "capacity",
    header: "Capacity",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Progress value={row.capacity} className="h-1.5 w-20" />
        <span className="text-xs text-muted-foreground">{row.capacity}%</span>
      </div>
    ),
  },
  { key: "accounts", header: "Accounts", render: (row) => row.accounts, hideOnMobile: true },
  { key: "status", header: "Status", render: (row) => <StatusPill value={row.status} /> },
];

function TeamPage() {
  const { teamMembers, isLoading } = useTeam();
  const { accounts } = useAccounts();
  const { resources } = useResources();

  const [active, setActive] = useState<Member | null>(null);
  const owned = active ? accounts.filter((a) => a.owner === active.name) : [];
  const assets = active ? resources.filter((r) => r.owner === active.name) : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Studio"
        title="Team"
        description="Who is loaded, who is free, and what each person is carrying this month."
        actions={<Button asChild>
            <Link to="/team/new">Invite member</Link>
          </Button>}
      />

      <RecordTable
        rows={teamMembers}
        columns={columns}
        activeId={active?.id}
        onRowClick={setActive}
        empty={isLoading ? "Loading roster…" : "No team members yet."}
      />

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => {
          if (!o) setActive(null);
        }}
        title={active?.name ?? ""}
        subtitle={active?.role}
        badge={active ? <StatusPill value={active.status} /> : null}
      >
        {active ? (
          <>
            <DetailGrid
              items={[
                { label: "Capacity used", value: `${active.capacity}%` },
                { label: "Accounts", value: String(active.accounts) },
                { label: "Focus", value: active.focus },
                { label: "Member ID", value: active.id },
              ]}
            />

            <DetailSection title="Load">
              <Progress value={active.capacity} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {active.capacity >= 85
                  ? "Overbooked — rebalance before adding new work."
                  : "Has room for one more sprint this month."}
              </p>
            </DetailSection>

            <DetailSection title="Accounts owned">
              {owned.length ? (
                <ul className="space-y-2">
                  {owned.map((a) => (
                    <li key={a.id} className="rounded-lg border bg-surface/50 px-3 py-2">
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.plan}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Supports delivery, no direct account ownership.</p>
              )}
            </DetailSection>

            <DetailSection title="Assets in flight">
              {assets.length ? (
                <ul className="space-y-2">
                  {assets.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-2 rounded-lg border bg-surface/50 px-3 py-2"
                    >
                      <span className="truncate text-sm">{r.title}</span>
                      <StatusPill value={r.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No open assets.</p>
              )}
            </DetailSection>
          </>
        ) : null}
      </DetailSheet>
      <CreateFab to="/team/new" label="Invite member" />
    </div>
  );
}
