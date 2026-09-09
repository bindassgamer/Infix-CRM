/**
 * Shared layout for the "create record" pages: a titled card with a form,
 * a save button and a cancel link back to the list page.
 */
import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { FormEvent, ReactNode } from "react";

import { PageHeader } from "@/components/crm/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function RecordFormPage({
  eyebrow,
  title,
  description,
  backTo,
  backLabel,
  submitLabel,
  isSaving,
  onSubmit,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  backTo: LinkProps["to"];
  backLabel: string;
  submitLabel: string;
  isSaving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {backLabel}
      </Link>

      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">{children}</div>

            <div className="flex flex-wrap gap-2 border-t pt-5">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : submitLabel}
              </Button>
              <Button type="button" variant="secondary" asChild>
                <Link to={backTo}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/** One labelled field. Pass `full` for a field that spans both columns. */
export function FormField({
  label,
  htmlFor,
  hint,
  full,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`space-y-2 ${full ? "sm:col-span-2" : ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
