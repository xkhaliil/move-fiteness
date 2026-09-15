import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4.5" y="9" width="11" height="8" rx="1.5" />
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

export function Chip({
  children,
  active = false,
  className,
  ...props
}: {
  children: ReactNode;
  active?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition whitespace-nowrap",
        active
          ? "border-accent-secondary/40 bg-accent-secondary/15 text-accent-secondary"
          : "border-border bg-surface text-text-muted hover:text-text",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ChipLink({
  href,
  active = false,
  children,
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition whitespace-nowrap",
        active
          ? "border-accent-secondary/40 bg-accent-secondary/15 text-accent-secondary"
          : "border-border bg-surface text-text-muted hover:text-text"
      )}
    >
      {children}
    </Link>
  );
}

export function LockedChip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-xs font-medium text-text-muted whitespace-nowrap"
    >
      <LockIcon />
      {children}
    </Link>
  );
}
