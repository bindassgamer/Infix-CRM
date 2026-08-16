import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const toneMap: Record<string, Tone> = {
  Healthy: "success",
  Paid: "success",
  Approved: "success",
  Published: "success",
  Won: "success",
  Available: "success",
  "At risk": "warning",
  Due: "warning",
  "In review": "warning",
  "Needs approval": "warning",
  Negotiation: "warning",
  Loaded: "warning",
  medium: "warning",
  "Churn risk": "danger",
  Overdue: "danger",
  Lost: "danger",
  high: "danger",
  "On leave": "neutral",
  Draft: "neutral",
  New: "neutral",
  low: "neutral",
  Qualified: "info",
  Scheduled: "info",
  Proposal: "primary",
};

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground ring-border",
  primary: "bg-primary/10 text-primary ring-primary/20",
  success: "bg-success/12 text-success ring-success/25",
  warning: "bg-warning/18 text-warning-foreground ring-warning/35",
  danger: "bg-destructive/12 text-destructive ring-destructive/25",
  info: "bg-info/12 text-info ring-info/25",
};

export function StatusPill({
  value,
  tone,
  className,
}: {
  value: string;
  tone?: Tone | undefined;
  className?: string | undefined;
}) {
  const resolved = tone ?? toneMap[value] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneClass[resolved],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {value}
    </span>
  );
}
