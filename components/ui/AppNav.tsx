"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FeedIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps} className="h-5 w-5">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps} className="h-5 w-5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps} className="h-5 w-5">
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps} className="h-5 w-5">
      <circle cx="12" cy="8" r="3.3" />
      <path d="M5 19.5c1.2-3.4 3.9-5 7-5s5.8 1.6 7 5" />
    </svg>
  );
}

const TABS = [
  { href: "/feed", label: "Feed", icon: FeedIcon },
  { href: "/activities/new", label: "Post", icon: PlusIcon },
  { href: "/notifications", label: "Alerts", icon: BellIcon },
  { href: "/profile", label: "Profile", icon: ProfileIcon },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/feed" && pathname.startsWith(href));
}

export function AppNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: fixed bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition",
                  active ? "text-accent" : "text-text-muted"
                )}
              >
                <span className="relative">
                  <Icon />
                  {tab.href === "/notifications" && unreadCount > 0 && (
                    <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-accent" />
                  )}
                </span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: fixed left sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-bg px-5 py-6 lg:flex">
        <Link href="/feed" className="font-display text-lg text-text">
          MOVE<span className="text-accent">!</span>
        </Link>

        <Link
          href="/activities/new"
          className="mt-6 flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-accent-ink transition hover:brightness-95 active:scale-[0.98]"
        >
          <PlusIcon />
          Post an activity
        </Link>

        <nav className="mt-6 flex flex-col gap-1">
          {TABS.filter((tab) => tab.href !== "/activities/new").map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:bg-surface-raised hover:text-text"
                )}
              >
                <span className="relative">
                  <Icon />
                  {tab.href === "/notifications" && unreadCount > 0 && (
                    <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-accent" />
                  )}
                </span>
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
