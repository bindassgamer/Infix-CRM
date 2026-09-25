/** One-line "showing X of Y" note under the page header. */
export function FilterSummary({
  shown,
  total,
  noun,
}: {
  shown: number;
  total: number;
  noun: string;
}) {
  if (shown === total) return null;

  return (
    <p className="text-sm text-muted-foreground">
      Showing {shown} of {total} {noun}.
    </p>
  );
}
