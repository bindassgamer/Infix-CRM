import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FormField, RecordFormPage } from "@/components/crm/record-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateResource } from "@/hooks/use-resources";
import { selectClassName, today } from "@/lib/form-helpers";
import type { Resource } from "@/types/crm";

export const Route = createFileRoute("/resources_/new")({
  head: () => ({
    meta: [
      { title: "New asset — MediaOps CRM" },
      {
        name: "description",
        content: "Add a reel, carousel, template or playbook with owner, format and review status.",
      },
      { property: "og:title", content: "New asset — MediaOps CRM" },
      { property: "og:description", content: "Add a deliverable to the creative library." },
    ],
  }),
  component: NewResourcePage,
});

const types: Resource["type"][] = ["Reel", "Carousel", "Static", "Video", "Template", "Playbook"];
const statuses: Resource["status"][] = ["Draft", "In review", "Approved", "Published"];

function NewResourcePage() {
  const navigate = useNavigate();
  const createResource = useCreateResource();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<Resource["type"]>("Reel");
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState<Resource["status"]>("Draft");
  const [format, setFormat] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createResource.mutate(
      { title, type, account, owner, status, updated: today(), format, summary },
      {
        onSuccess: () => {
          toast.success(`${title} added to resources`);
          navigate({ to: "/resources" });
        },
        onError: () => toast.error("Could not save the asset"),
      },
    );
  };

  return (
    <RecordFormPage
      eyebrow="Creative library"
      title="New asset"
      description="Where it belongs, who owns it and where it sits in review."
      backTo="/resources"
      backLabel="Back to resources"
      submitLabel="Create asset"
      isSaving={createResource.isPending}
      onSubmit={handleSubmit}
    >
      <FormField label="Asset title" htmlFor="title">
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>
      <FormField label="Type" htmlFor="type">
        <select
          id="type"
          className={selectClassName}
          value={type}
          onChange={(e) => setType(e.target.value as Resource["type"])}
        >
          {types.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Account" htmlFor="account">
        <Input id="account" value={account} onChange={(e) => setAccount(e.target.value)} required />
      </FormField>
      <FormField label="Owner" htmlFor="owner">
        <Input id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} required />
      </FormField>
      <FormField label="Status" htmlFor="status">
        <select
          id="status"
          className={selectClassName}
          value={status}
          onChange={(e) => setStatus(e.target.value as Resource["status"])}
        >
          {statuses.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Format" htmlFor="format" hint="For example 9:16 · 30s">
        <Input id="format" value={format} onChange={(e) => setFormat(e.target.value)} />
      </FormField>
      <FormField label="Summary" htmlFor="summary" full>
        <Textarea
          id="summary"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </FormField>
    </RecordFormPage>
  );
}
