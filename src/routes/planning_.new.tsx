import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FormField, RecordFormPage } from "@/components/crm/record-form";
import { Input } from "@/components/ui/input";
import { useCreateScheduleItem } from "@/hooks/use-schedule";
import { selectClassName } from "@/lib/form-helpers";
import type { ScheduleItem } from "@/types/crm";

export const Route = createFileRoute("/planning_/new")({
  head: () => ({
    meta: [
      { title: "Schedule a media drop — MediaOps CRM" },
      {
        name: "description",
        content: "Book a post on the publishing calendar with channel, day, time and owner.",
      },
      { property: "og:title", content: "Schedule a media drop — MediaOps CRM" },
      { property: "og:description", content: "Book a post on the publishing calendar." },
    ],
  }),
  component: NewScheduleItemPage,
});

const channels: ScheduleItem["channel"][] = [
  "Instagram",
  "YouTube",
  "LinkedIn",
  "TikTok",
  "Newsletter",
];
const statuses: ScheduleItem["status"][] = ["Scheduled", "Needs approval", "Published"];

function NewScheduleItemPage() {
  const navigate = useNavigate();
  const createScheduleItem = useCreateScheduleItem();

  const [title, setTitle] = useState("");
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [day, setDay] = useState(String(new Date().getDate()));
  const [time, setTime] = useState("10:00");
  const [channel, setChannel] = useState<ScheduleItem["channel"]>("Instagram");
  const [status, setStatus] = useState<ScheduleItem["status"]>("Scheduled");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createScheduleItem.mutate(
      { title, account, owner, day: Number(day) || 1, time, channel, status },
      {
        onSuccess: () => {
          toast.success(`${title} added to the calendar`);
          navigate({ to: "/planning" });
        },
        onError: () => toast.error("Could not save the calendar slot"),
      },
    );
  };

  return (
    <RecordFormPage
      eyebrow="Planning"
      title="Schedule a media drop"
      description="What goes out, on which channel, on what day and who is responsible."
      backTo="/planning"
      backLabel="Back to planning"
      submitLabel="Add to calendar"
      isSaving={createScheduleItem.isPending}
      onSubmit={handleSubmit}
    >
      <FormField label="Post title" htmlFor="title" full>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>
      <FormField label="Account" htmlFor="account">
        <Input id="account" value={account} onChange={(e) => setAccount(e.target.value)} required />
      </FormField>
      <FormField label="Owner" htmlFor="owner">
        <Input id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} required />
      </FormField>
      <FormField label="Day of month" htmlFor="day" hint="1–31">
        <Input
          id="day"
          type="number"
          min="1"
          max="31"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
      </FormField>
      <FormField label="Time" htmlFor="time">
        <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </FormField>
      <FormField label="Channel" htmlFor="channel">
        <select
          id="channel"
          className={selectClassName}
          value={channel}
          onChange={(e) => setChannel(e.target.value as ScheduleItem["channel"])}
        >
          {channels.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Status" htmlFor="status">
        <select
          id="status"
          className={selectClassName}
          value={status}
          onChange={(e) => setStatus(e.target.value as ScheduleItem["status"])}
        >
          {statuses.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </FormField>
    </RecordFormPage>
  );
}
