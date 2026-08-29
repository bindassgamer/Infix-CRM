import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CalendarDays, IndianRupee, Target, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/components/crm/page-header";
import { StatCard } from "@/components/crm/stat-card";
import { StatusPill } from "@/components/crm/status-pill";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import { useAccounts } from "@/hooks/use-accounts";
import { useLeads } from "@/hooks/use-leads";
import { useNotifications } from "@/hooks/use-notifications";
import { useSchedule } from "@/hooks/use-schedule";
import { useTeam } from "@/hooks/use-team";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — MediaOps CRM" },
      {
        name: "description",
        content:
          "Studio overview: active retainers, pipeline value, team load and the next scheduled media drops.",
      },
      { property: "og:title", content: "Overview — MediaOps CRM" },
      {
        property: "og:description",
        content: "Retainers, pipeline, team load and upcoming media drops at a glance.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const openPipeline = leads
    .filter((l) => l.stage !== "Won" && l.stage !== "Lost")
    .reduce((sum, l) => sum + l.value, 0);
  const mrr = accounts.reduce((sum, a) => sum + a.retainer, 0);
  const avgLoad = Math.round(team.reduce((s, m) => s + m.capacity, 0) / team.length);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Studio pulse"
        title="Good morning, Abhay"
        description="Five retainers running, three deals in play and twelve media drops queued this month."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Working clients"
          value={String(accounts.length)}
          hint="2 flagged for a health review"
          icon={Building2}
        />
        <StatCard
          label="Monthly retainers"
          value={formatCurrency(mrr)}
          hint="1 invoice overdue"
          icon={IndianRupee}
        />
        <StatCard
          label="Open pipeline"
          value={formatCurrency(openPipeline)}
          hint="4 active leads"
          icon={Target}
        />
        <StatCard label="Avg team load" value={`${avgLoad}%`} hint="6 people" icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Pipeline by stage</h2>
            <Link to="/leads" className="text-sm font-medium text-primary hover:underline">
              View leads
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {(["New", "Qualified", "Proposal", "Negotiation"] as const).map((stage) => {
              const stageLeads = leads.filter((l) => l.stage === stage);
              const value = stageLeads.reduce((s, l) => s + l.value, 0);
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{stage}</span>
                    <span className="text-muted-foreground">
                      {stageLeads.length} · {formatCurrency(value)}
                    </span>
                  </div>
                  <Progress
                    value={openPipeline ? (value / openPipeline) * 100 : 0}
                    className="mt-2 h-2"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Alerts</h2>
            <Link to="/notifications" className="text-sm font-medium text-primary hover:underline">
              All
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id} className="rounded-lg border bg-surface/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  <StatusPill value={n.severity} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {n.account} · {n.when}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Next media drops</h2>
            <Link to="/planning" className="text-sm font-medium text-primary hover:underline">
              Open calendar
            </Link>
          </div>
          <ul className="mt-4 divide-y">
            {schedule.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/20 text-xs font-semibold text-accent-foreground">
                  {item.day}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.account} · {item.channel} · {item.time}
                  </p>
                </div>
                <StatusPill value={item.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Team load</h2>
            <Link to="/team" className="text-sm font-medium text-primary hover:underline">
              Manage team
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {team.slice(0, 5).map((m) => (
              <li key={m.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted-foreground">{m.capacity}%</span>
                </div>
                <Progress value={m.capacity} className="mt-2 h-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.role} · {m.accounts} accounts
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="size-3.5" /> Capacity trending up 6% versus last month
          </p>
          <p className="sr-only">
            <CalendarDays className="size-3" />
          </p>
        </div>
      </div>
    </div>
  );
}
