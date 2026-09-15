import { cn } from "@/lib/cn";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77L1.62 7.59l5.79-.84L10 1.5z" />
    </svg>
  );
}

export function RatingBadge({
  average,
  count,
  size = "md",
  showCount = true,
}: {
  average: number | null;
  count: number;
  size?: "sm" | "md";
  showCount?: boolean;
}) {
  if (average === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-text-muted",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        New host
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium text-accent",
        size === "sm" ? "text-xs" : "text-sm"
      )}
    >
      <StarIcon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span>{average.toFixed(1)}</span>
      {showCount && (
        <span className="text-text-muted font-normal">· {count} ratings</span>
      )}
    </span>
  );
}
