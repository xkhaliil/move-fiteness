import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-6 py-14 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised text-text-muted">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-text">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-text-muted">{description}</p>
      )}
      {action}
    </div>
  );
}
