import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, CreditCard, Settings2 } from "lucide-react";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
import { PageHeader } from "@/components/crm/page-header";
import { StatusPill } from "@/components/crm/status-pill";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/format";
import { useAccounts } from "@/hooks/use-accounts";
import { useNotifications } from "@/hooks/use-notifications";
import type { Notification } from "@/types/crm";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — MediaOps CRM" },
      {
        name: "description",
        content:
          "Client alerts, approval requests and payment reminders for every retainer, in one prioritised inbox.",
      },
      { property: "og:title", content: "Notifications — MediaOps CRM" },
      {
        property: "og:description",
        content: "Payment alerts, approvals and client signals in one prioritised inbox.",
      },
    ],
  }),
  component: NotificationsPage,
});

const kindIcon = {
  payment: CreditCard,
  client: Bell,
  system: Settings2,
} as const;

const tabs = [
  { value: "all", label: "All" },
  { value: "payment", label: "Payments" },
  { value: "client", label: "Clients" },
  { value: "system", label: "Automation" },
] as const;

function NotificationsPage() {
  const [tab, setTab] = useState<string>("all");
  const [active, setActive] = useState<Notification | null>(null);

  const rows = useMemo(
    () => (tab === "all" ? notifications : notifications.filter((n) => n.kind === tab)),
    [tab],
  );

  const overdue = accounts.filter((a) => a.paymentStatus === "Overdue");
  const due = accounts.filter((a) => a.paymentStatus === "Due");
  const account = active ? accounts.find((a) => a.name === active.account) : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Payment alerts, approvals and client signals. Click an alert for the full context."
        actions={<Button variant="secondary">Mark all read</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="mt-1 font-display text-xl font-semibold text-destructive">
            {formatCurrency(overdue.reduce((s, a) => s + a.retainer, 0))}
          </p>
          <p className="text-xs text-muted-foreground">{overdue.length} account</p>
        </div>
        <div className="panel p-4">
          <p className="text-sm text-muted-foreground">Due this month</p>
          <p className="mt-1 font-display text-xl font-semibold">
            {formatCurrency(due.reduce((s, a) => s + a.retainer, 0))}
          </p>
          <p className="text-xs text-muted-foreground">{due.length} accounts</p>
        </div>
        <div className="panel p-4">
          <p className="text-sm text-muted-foreground">Needs approval</p>
          <p className="mt-1 font-display text-xl font-semibold">2</p>
          <p className="text-xs text-muted-foreground">Blocking scheduled drops</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ul className="space-y-3">
        {rows.map((n) => {
          const Icon = kindIcon[n.kind];
          return (
            <li key={n.id}>
              <button
                onClick={() => setActive(n)}
                className="panel row-hover flex w-full items-start gap-3 p-4 text-left hover:shadow-lift"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    <StatusPill value={n.severity} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.detail}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {n.account} · {n.when}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => {
          if (!o) setActive(null);
        }}
        title={active?.title ?? ""}
        subtitle={active ? `${active.account} · ${active.when}` : undefined}
        badge={active ? <StatusPill value={active.severity} /> : null}
      >
        {active ? (
          <>
            <DetailSection title="Detail">
              <p className="text-muted-foreground">{active.detail}</p>
            </DetailSection>

            {account ? (
              <>
                <DetailGrid
                  items={[
                    { label: "Retainer", value: `${formatCurrency(account.retainer)} / mo` },
                    { label: "Payment status", value: <StatusPill value={account.paymentStatus} /> },
                    { label: "Next invoice", value: account.nextInvoice },
                    { label: "Owner", value: account.owner },
                  ]}
                />
                <DetailSection title="Plan context">
                  <p className="text-muted-foreground">{account.plan}</p>
                </DetailSection>
              </>
            ) : null}

            <div className="flex gap-2">
              <Button className="flex-1">
                {active.kind === "payment" ? "Send reminder" : "Take action"}
              </Button>
              <Button variant="secondary" className="flex-1">
                Snooze
              </Button>
            </div>
          </>
        ) : null}
      </DetailSheet>
    </div>
  );
}
