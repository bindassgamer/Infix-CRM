import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
import { CreateFab } from "@/components/crm/create-fab";
import { PageHeader } from "@/components/crm/page-header";
import { RecordTable, type Column } from "@/components/crm/record-table";
import { StatusPill } from "@/components/crm/status-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useAccounts } from "@/hooks/use-accounts";
import { useContacts } from "@/hooks/use-contacts";
import { useSchedule } from "@/hooks/use-schedule";
import type { Account } from "@/types/crm";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — MediaOps CRM" },
      {
        name: "description",
        content:
          "Every working client with retainer value, account health, payment status and the delivery process behind their plan.",
      },
      { property: "og:title", content: "Accounts — MediaOps CRM" },
      {
        property: "og:description",
        content: "Working clients, retainers, health and delivery process in one list.",
      },
    ],
  }),
  component: AccountsPage,
});

const columns: Column<Account>[] = [
  {
    key: "name",
    header: "Account",
    render: (row) => (
      <div>
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-muted-foreground">
          {row.id} · {row.industry}
        </p>
      </div>
    ),
  },
  { key: "owner", header: "Owner", render: (row) => row.owner, hideOnMobile: true },
  {
    key: "retainer",
    header: "Retainer / mo",
    render: (row) => <span className="font-medium">{formatCurrency(row.retainer)}</span>,
  },
  { key: "health", header: "Health", render: (row) => <StatusPill value={row.health} /> },
  {
    key: "payment",
    header: "Payment",
    render: (row) => <StatusPill value={row.paymentStatus} />,
    hideOnMobile: true,
  },
  {
    key: "invoice",
    header: "Next invoice",
    render: (row) => <span className="text-muted-foreground">{row.nextInvoice}</span>,
    hideOnMobile: true,
  },
];

function AccountsPage() {
  const { accounts, isLoading } = useAccounts();
  const { contacts } = useContacts();
  const { scheduleItems } = useSchedule();

  const [active, setActive] = useState<Account | null>(null);
  const contact = active ? contacts.find((c) => c.id === active.contactId) : undefined;
  const upcoming = active ? scheduleItems.filter((item) => item.account === active.name) : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Clients"
        title="Accounts"
        description="Click any row to open the retainer plan, delivery process and billing state."
        actions={<Button asChild>
            <Link to="/accounts/new">New account</Link>
          </Button>}
      />

      <RecordTable
        rows={accounts}
        columns={columns}
        activeId={active?.id}
        onRowClick={setActive}
        empty={isLoading ? "Loading accounts…" : "No accounts yet."}
      />

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        title={active?.name ?? ""}
        subtitle={active ? `${active.industry} · client since ${active.since}` : undefined}
        badge={active ? <StatusPill value={active.health} /> : null}
      >
        {active ? (
          <>
            <DetailGrid
              items={[
                { label: "Retainer", value: `${formatCurrency(active.retainer)} / mo` },
                { label: "Account owner", value: active.owner },
                { label: "Payment status", value: <StatusPill value={active.paymentStatus} /> },
                { label: "Next invoice", value: active.nextInvoice },
              ]}
            />

            <DetailSection title="Plan">
              <p className="text-muted-foreground">{active.plan}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.services.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </DetailSection>

            <DetailSection title="Process">
              <ol className="space-y-2.5">
                {active.process.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </DetailSection>

            <DetailSection title="Primary contact">
              {contact ? (
                <div className="rounded-lg border bg-surface/50 p-3">
                  <p className="font-medium">
                    {contact.name} · <span className="text-muted-foreground">{contact.role}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {contact.email} · {contact.phone}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{contact.notes}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No contact linked.</p>
              )}
            </DetailSection>

            <DetailSection title="Scheduled this month">
              {upcoming.length ? (
                <ul className="divide-y">
                  {upcoming.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-2.5">
                      <span className="grid size-8 place-items-center rounded-md bg-accent/20 text-xs font-semibold text-accent-foreground">
                        {item.day}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.channel} · {item.time} · {item.owner}
                        </p>
                      </div>
                      <StatusPill value={item.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nothing scheduled yet.</p>
              )}
            </DetailSection>
          </>
        ) : null}
      </DetailSheet>
      <CreateFab to="/accounts/new" label="New account" />
    </div>
  );
}
