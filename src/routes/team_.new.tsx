import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FormField, RecordFormPage } from "@/components/crm/record-form";
import { Input } from "@/components/ui/input";
import { useCreateTeamMember } from "@/hooks/use-team";
import { selectClassName } from "@/lib/form-helpers";
import type { Member } from "@/types/crm";

export const Route = createFileRoute("/team_/new")({
  head: () => ({
    meta: [
      { title: "New team member — MediaOps CRM" },
      {
        name: "description",
        content: "Add someone to the studio roster with role, focus area and current capacity.",
      },
      { property: "og:title", content: "New team member — MediaOps CRM" },
      { property: "og:description", content: "Add someone to the studio roster." },
    ],
  }),
  component: NewMemberPage,
});

const statuses: Member["status"][] = ["Available", "Loaded", "On leave"];

function NewMemberPage() {
  const navigate = useNavigate();
  const createMember = useCreateTeamMember();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [focus, setFocus] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [accounts, setAccounts] = useState("0");
  const [status, setStatus] = useState<Member["status"]>("Available");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createMember.mutate(
      {
        name,
        role,
        focus,
        capacity: Number(capacity) || 0,
        accounts: Number(accounts) || 0,
        status,
      },
      {
        onSuccess: () => {
          toast.success(`${name} added to the team`);
          navigate({ to: "/team" });
        },
        onError: () => toast.error("Could not save the team member"),
      },
    );
  };

  return (
    <RecordFormPage
      eyebrow="Studio"
      title="New team member"
      description="Role, focus and how loaded they already are this month."
      backTo="/team"
      backLabel="Back to team"
      submitLabel="Add member"
      isSaving={createMember.isPending}
      onSubmit={handleSubmit}
    >
      <FormField label="Full name" htmlFor="name">
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </FormField>
      <FormField label="Role" htmlFor="role">
        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
      </FormField>
      <FormField label="Focus" htmlFor="focus" full>
        <Input id="focus" value={focus} onChange={(e) => setFocus(e.target.value)} />
      </FormField>
      <FormField label="Capacity used" htmlFor="capacity" hint="0–100%">
        <Input
          id="capacity"
          type="number"
          min="0"
          max="100"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
      </FormField>
      <FormField label="Accounts" htmlFor="accounts">
        <Input
          id="accounts"
          type="number"
          min="0"
          value={accounts}
          onChange={(e) => setAccounts(e.target.value)}
        />
      </FormField>
      <FormField label="Status" htmlFor="status">
        <select
          id="status"
          className={selectClassName}
          value={status}
          onChange={(e) => setStatus(e.target.value as Member["status"])}
        >
          {statuses.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>
    </RecordFormPage>
  );
}
