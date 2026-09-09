import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FormField, RecordFormPage } from "@/components/crm/record-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAccount } from "@/hooks/use-accounts";
import { selectClassName, splitLines, splitList, today } from "@/lib/form-helpers";
import type { Health } from "@/types/crm";

export const Route = createFileRoute("/accounts_/new")({
  head: () => ({
    meta: [
      { title: "New account — MediaOps CRM" },
      {
        name: "description",
        content: "Add a retainer client with owner, plan, services and billing details.",
      },
      { property: "og:title", content: "New account — MediaOps CRM" },
      { property: "og:description", content: "Add a retainer client to the studio book." },
    ],
  }),
  component: NewAccountPage,
});

function NewAccountPage() {
  const navigate = useNavigate();
  const createAccount = useCreateAccount();

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [owner, setOwner] = useState("");
  const [retainer, setRetainer] = useState("");
  const [health, setHealth] = useState<Health>("Healthy");
  const [since, setSince] = useState(today());
  const [services, setServices] = useState("");
  const [plan, setPlan] = useState("");
  const [process, setProcess] = useState("");
  const [nextInvoice, setNextInvoice] = useState(today());
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Due" | "Overdue">("Due");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createAccount.mutate(
      {
        name,
        industry,
        owner,
        retainer: Number(retainer) || 0,
        health,
        since,
        services: splitList(services),
        plan,
        process: splitLines(process),
        nextInvoice,
        paymentStatus,
        contactId: "",
      },
      {
        onSuccess: () => {
          toast.success(`${name} added to accounts`);
          navigate({ to: "/accounts" });
        },
        onError: () => toast.error("Could not save the account"),
      },
    );
  };

  return (
    <RecordFormPage
      eyebrow="Clients"
      title="New account"
      description="Capture the retainer, who owns it internally and how delivery runs."
      backTo="/accounts"
      backLabel="Back to accounts"
      submitLabel="Create account"
      isSaving={createAccount.isPending}
      onSubmit={handleSubmit}
    >
      <FormField label="Account name" htmlFor="name">
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </FormField>
      <FormField label="Industry" htmlFor="industry">
        <Input
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          required
        />
      </FormField>
      <FormField label="Internal owner" htmlFor="owner">
        <Input id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} required />
      </FormField>
      <FormField label="Monthly retainer" htmlFor="retainer" hint="Amount in USD">
        <Input
          id="retainer"
          type="number"
          min="0"
          value={retainer}
          onChange={(e) => setRetainer(e.target.value)}
          required
        />
      </FormField>
      <FormField label="Health" htmlFor="health">
        <select
          id="health"
          className={selectClassName}
          value={health}
          onChange={(e) => setHealth(e.target.value as Health)}
        >
          {(["Healthy", "At risk", "Churn risk"] as Health[]).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Client since" htmlFor="since">
        <Input id="since" value={since} onChange={(e) => setSince(e.target.value)} required />
      </FormField>
      <FormField label="Services" htmlFor="services" hint="Separate with commas" full>
        <Input
          id="services"
          value={services}
          onChange={(e) => setServices(e.target.value)}
          placeholder="Reels production, Paid social"
        />
      </FormField>
      <FormField label="Plan" htmlFor="plan" full>
        <Textarea
          id="plan"
          rows={2}
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="Growth retainer — 16 assets / month"
        />
      </FormField>
      <FormField label="Process" htmlFor="process" hint="One step per line" full>
        <Textarea
          id="process"
          rows={4}
          value={process}
          onChange={(e) => setProcess(e.target.value)}
        />
      </FormField>
      <FormField label="Next invoice" htmlFor="nextInvoice">
        <Input
          id="nextInvoice"
          value={nextInvoice}
          onChange={(e) => setNextInvoice(e.target.value)}
        />
      </FormField>
      <FormField label="Payment status" htmlFor="paymentStatus">
        <select
          id="paymentStatus"
          className={selectClassName}
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as "Paid" | "Due" | "Overdue")}
        >
          {["Paid", "Due", "Overdue"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>
    </RecordFormPage>
  );
}
