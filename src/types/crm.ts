export type Stage = "New" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";
export type Health = "Healthy" | "At risk" | "Churn risk";

export type Account = {
  id: string;
  name: string;
  industry: string;
  owner: string;
  retainer: number;
  health: Health;
  since: string;
  services: string[];
  plan: string;
  process: string[];
  nextInvoice: string;
  paymentStatus: "Paid" | "Due" | "Overdue";
  contactId: string;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  account: string;
  email: string;
  phone: string;
  channel: string;
  lastTouch: string;
  notes: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  source: string;
  stage: Stage;
  value: number;
  owner: string;
  created: string;
  score: number;
  need: string;
  nextStep: string;
  timeline: { date: string; event: string }[];
};

export type Resource = {
  id: string;
  title: string;
  type: "Reel" | "Carousel" | "Static" | "Video" | "Template" | "Playbook";
  account: string;
  owner: string;
  status: "Draft" | "In review" | "Approved" | "Published";
  updated: string;
  format: string;
  summary: string;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  capacity: number;
  accounts: number;
  focus: string;
  status: "Available" | "Loaded" | "On leave";
};

export type ScheduleItem = {
  id: string;
  day: number;
  time: string;
  account: string;
  title: string;
  channel: "Instagram" | "YouTube" | "LinkedIn" | "TikTok" | "Newsletter";
  owner: string;
  status: "Scheduled" | "Needs approval" | "Published";
};

export type Notification = {
  id: string;
  kind: "payment" | "client" | "system";
  title: string;
  detail: string;
  account: string;
  when: string;
  severity: "high" | "medium" | "low";
};

