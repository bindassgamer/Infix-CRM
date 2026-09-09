import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FormField, RecordFormPage } from "@/components/crm/record-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateContact } from "@/hooks/use-contacts";
import { today } from "@/lib/form-helpers";

export const Route = createFileRoute("/contacts_/new")({
  head: () => ({
    meta: [
      { title: "New contact — MediaOps CRM" },
      {
        name: "description",
        content: "Add a client-side person with role, account, channel and working notes.",
      },
      { property: "og:title", content: "New contact — MediaOps CRM" },
      { property: "og:description", content: "Add a person behind one of your accounts." },
    ],
  }),
  component: NewContactPage,
});

function NewContactPage() {
  const navigate = useNavigate();
  const createContact = useCreateContact();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [account, setAccount] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState("Email");
  const [lastTouch, setLastTouch] = useState(today());
  const [notes, setNotes] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createContact.mutate(
      { name, role, account, email, phone, channel, lastTouch, notes },
      {
        onSuccess: () => {
          toast.success(`${name} added to contacts`);
          navigate({ to: "/contacts" });
        },
        onError: () => toast.error("Could not save the contact"),
      },
    );
  };

  return (
    <RecordFormPage
      eyebrow="People"
      title="New contact"
      description="Who they are, what they own on their side and how they prefer to be reached."
      backTo="/contacts"
      backLabel="Back to contacts"
      submitLabel="Create contact"
      isSaving={createContact.isPending}
      onSubmit={handleSubmit}
    >
      <FormField label="Full name" htmlFor="name">
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </FormField>
      <FormField label="Role" htmlFor="role">
        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
      </FormField>
      <FormField label="Account" htmlFor="account">
        <Input id="account" value={account} onChange={(e) => setAccount(e.target.value)} required />
      </FormField>
      <FormField label="Preferred channel" htmlFor="channel">
        <Input id="channel" value={channel} onChange={(e) => setChannel(e.target.value)} />
      </FormField>
      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormField>
      <FormField label="Phone" htmlFor="phone">
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>
      <FormField label="Last touch" htmlFor="lastTouch">
        <Input id="lastTouch" value={lastTouch} onChange={(e) => setLastTouch(e.target.value)} />
      </FormField>
      <FormField label="Working notes" htmlFor="notes" full>
        <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </FormField>
    </RecordFormPage>
  );
}
