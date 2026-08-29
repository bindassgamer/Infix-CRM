import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";

import { DetailGrid, DetailSection, DetailSheet } from "@/components/crm/detail-sheet";
import { PageHeader } from "@/components/crm/page-header";
import { RecordTable, type Column } from "@/components/crm/record-table";
import { Button } from "@/components/ui/button";
import { formatInitials } from "@/lib/format";
import { useAccounts } from "@/hooks/use-accounts";
import { useContacts } from "@/hooks/use-contacts";
import type { Contact } from "@/types/crm";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — MediaOps CRM" },
      {
        name: "description",
        content:
          "People behind every account: roles, preferred channels, last touchpoint and working notes.",
      },
      { property: "og:title", content: "Contacts — MediaOps CRM" },
      {
        property: "og:description",
        content: "Client-side people, channels and last touchpoints.",
      },
    ],
  }),
  component: ContactsPage,
});

const columns: Column<Contact>[] = [
  {
    key: "name",
    header: "Contact",
    render: (row) => (
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {formatInitials(row.name)}
        </span>
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.role}</p>
        </div>
      </div>
    ),
  },
  { key: "account", header: "Account", render: (row) => row.account },
  {
    key: "email",
    header: "Email",
    render: (row) => <span className="text-muted-foreground">{row.email}</span>,
    hideOnMobile: true,
  },
  { key: "channel", header: "Channel", render: (row) => row.channel, hideOnMobile: true },
  {
    key: "lastTouch",
    header: "Last touch",
    render: (row) => <span className="text-muted-foreground">{row.lastTouch}</span>,
    hideOnMobile: true,
  },
];

function ContactsPage() {
  const { contacts, isLoading } = useContacts();
  const { accounts } = useAccounts();

  const [active, setActive] = useState<Contact | null>(null);
  const account = active ? accounts.find((a) => a.name === active.account) : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="People"
        title="Contacts"
        description="Open a contact to see how they like to be reached and what they own on their side."
        actions={<Button>Add contact</Button>}
      />

      <RecordTable
        rows={contacts}
        columns={columns}
        activeId={active?.id}
        onRowClick={setActive}
        empty={isLoading ? "Loading contacts…" : "No contacts yet."}
      />

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        title={active?.name ?? ""}
        subtitle={active ? `${active.role} · ${active.account}` : undefined}
      >
        {active ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary">
                <Mail className="size-4" /> Email
              </Button>
              <Button size="sm" variant="secondary">
                <Phone className="size-4" /> Call
              </Button>
              <Button size="sm" variant="secondary">
                <MessageSquare className="size-4" /> Message
              </Button>
            </div>

            <DetailGrid
              items={[
                { label: "Email", value: active.email },
                { label: "Phone", value: active.phone },
                { label: "Preferred channel", value: active.channel },
                { label: "Last touch", value: active.lastTouch },
              ]}
            />

            <DetailSection title="Working notes">
              <p className="text-muted-foreground">{active.notes}</p>
            </DetailSection>

            {account ? (
              <DetailSection title="Their plan">
                <p className="text-muted-foreground">{account.plan}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Owned internally by {account.owner} · next invoice {account.nextInvoice}
                </p>
              </DetailSection>
            ) : null}
          </>
        ) : null}
      </DetailSheet>
    </div>
  );
}
