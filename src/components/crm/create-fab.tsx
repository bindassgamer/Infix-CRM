/** Floating "+" button, pinned bottom-right, that opens a create page. */
import { Link, type LinkProps } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export function CreateFab({ to, label }: { to: NonNullable<LinkProps["to"]>; label: string }) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Plus className="size-6" />
    </Link>
  );
}
