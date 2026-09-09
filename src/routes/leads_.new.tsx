import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FormField, RecordFormPage } from "@/components/crm/record-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLead } from "@/hooks/use-leads";
import { selectClassName, today } from "@/lib/form-helpers";
import type { Stage } from "@/types/crm";

export const Route = createFileRoute("/leads_/new")({
  head: () => ({
    meta: [
      { title: "New lead — MediaOps CRM" },
      {
        name: "description",
        content: "Log an inbound or outbound lead with stage, value, owner and next step.",
      },
      { property: "og:title", content: "New lead — MediaOps CRM" },
      { property: "og:description", content: "Add an opportunity to the pipeline." },
    ],
  }),
  component: NewLeadPage,
});

const stages: Stage[] = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

function NewLeadPage() {
  const navigate = useNavigate();
  const createLead = useCreateLead();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState("Referral");
  const [stage, setStage] = useState<Stage>("New");
  const [value, setValue] = useState("");
  const [owner, setOwner] = useState("");
  const [score, setScore] = useState("50");
  const [need, setNeed] = useState("");
  const [nextStep, setNextStep] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = today();

    createLead.mutate(
      {
        name,
        company,
        source,
        stage,
        value: Number(value) || 0,
        owner,
        created,
        score: Number(score) || 0,
        need,
        nextStep,
        timeline: [{ date: created, event: "Lead created" }],
      },
      {
        onSuccess: () => {
          toast.success(`${name} added to the pipeline`);
          navigate({ to: "/leads" });
        },
        onError: () => toast.error("Could not save the lead"),
      },
    );
  };

  return (
    <RecordFormPage
      eyebrow="Pipeline"
      title="New lead"
      description="What they need, what it is worth and what happens next."
      backTo="/leads"
      backLabel="Back to leads"
      submitLabel="Create lead"
      isSaving={createLead.isPending}
      onSubmit={handleSubmit}
    >
      <FormField label="Contact name" htmlFor="name">
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </FormField>
      <FormField label="Company" htmlFor="company">
        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
      </FormField>
      <FormField label="Source" htmlFor="source">
        <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} />
      </FormField>
      <FormField label="Stage" htmlFor="stage">
        <select
          id="stage"
          className={selectClassName}
          value={stage}
          onChange={(e) => setStage(e.target.value as Stage)}
        >
          {stages.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Deal value" htmlFor="value" hint="Amount in USD">
        <Input
          id="value"
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </FormField>
      <FormField label="Owner" htmlFor="owner">
        <Input id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} required />
      </FormField>
      <FormField label="Score" htmlFor="score" hint="0–100">
        <Input
          id="score"
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </FormField>
      <FormField label="Next step" htmlFor="nextStep">
        <Input id="nextStep" value={nextStep} onChange={(e) => setNextStep(e.target.value)} />
      </FormField>
      <FormField label="What they need" htmlFor="need" full>
        <Textarea id="need" rows={3} value={need} onChange={(e) => setNeed(e.target.value)} />
      </FormField>
    </RecordFormPage>
  );
}
