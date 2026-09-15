import Link from "next/link";
import type { ReactNode } from "react";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function TopBar({
  title,
  backHref,
  action,
}: {
  title: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-bg/95 px-4 backdrop-blur lg:h-20 lg:px-8">
      <div className="flex items-center gap-2 lg:gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-text hover:bg-surface-raised lg:h-10 lg:w-10"
            aria-label="Back"
          >
            <BackIcon />
          </Link>
        )}
        <h1 className="font-display text-sm tracking-wide text-text uppercase lg:text-lg lg:normal-case">
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}
