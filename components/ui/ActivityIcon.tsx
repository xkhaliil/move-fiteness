import type { ReactElement } from "react";
import type { ActivityType } from "@/lib/types";
import { cn } from "@/lib/cn";

const commonProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconRunning() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <circle cx="15" cy="4.5" r="1.75" />
      <path d="M13 7.5 9.5 11l2.5 2 -1 5" />
      <path d="M9.5 11 5.5 13" />
      <path d="M12 13l3.5 1.5 2 4" />
      <path d="M11 16l-3 1.5" />
    </svg>
  );
}

function IconWalking() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <circle cx="13" cy="4.5" r="1.75" />
      <path d="M12 7.5 10 12l2.5 1.5 -0.5 5.5" />
      <path d="M10 12 7 14" />
      <path d="M12.5 13.5 15 15l1 4" />
    </svg>
  );
}

function IconCycling() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17 10 9h4l4 8" />
      <path d="M10 9 9 6h-2" />
      <path d="M10 9 13 13h5" />
    </svg>
  );
}

function IconBasketball() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4v16" />
      <path d="M6.3 6.3c2 2 2 9.4 0 11.4" />
      <path d="M17.7 6.3c-2 2-2 9.4 0 11.4" />
    </svg>
  );
}

function IconFootball() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8.3 15 10.5l-1.1 3.6H10L9 10.5z" />
      <path d="M12 8.3V5.5" />
      <path d="M15 10.5l2.6-1" />
      <path d="M13.9 14.1l1.6 2.4" />
      <path d="M10.1 14.1l-1.6 2.4" />
      <path d="M9 10.5l-2.6-1" />
    </svg>
  );
}

function IconPadel() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <rect x="6" y="3.5" width="9" height="11" rx="4.2" />
      <circle cx="9" cy="8" r="0.4" fill="currentColor" />
      <circle cx="12" cy="8" r="0.4" fill="currentColor" />
      <circle cx="10.5" cy="10.5" r="0.4" fill="currentColor" />
      <path d="M8.5 14 5 20" />
    </svg>
  );
}

function IconBadminton() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <circle cx="10" cy="8" r="5.5" />
      <path d="M10 2.5v11" />
      <path d="M4.5 8h11" />
      <path d="M6.5 4.5l7 7" />
      <path d="M13.5 4.5l-7 7" />
      <path d="M13.8 13.8 19 19" />
      <path d="M17.5 21 19 19l1.5 1.5" />
    </svg>
  );
}

function IconGym() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <rect x="2.5" y="9.5" width="2.5" height="5" rx="0.6" />
      <rect x="19" y="9.5" width="2.5" height="5" rx="0.6" />
      <path d="M5 12h14" />
      <rect x="6" y="8" width="2" height="8" rx="0.7" />
      <rect x="16" y="8" width="2" height="8" rx="0.7" />
    </svg>
  );
}

function IconYoga() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <circle cx="12" cy="5" r="1.75" />
      <path d="M12 7.5v4" />
      <path d="M12 11.5 6 16" />
      <path d="M12 11.5 18 16" />
      <path d="M6 16h12" />
      <path d="M12 11.5v6.5" />
    </svg>
  );
}

function IconSwimming() {
  return (
    <svg viewBox="0 0 24 24" {...commonProps}>
      <circle cx="6" cy="7" r="1.6" />
      <path d="M8 9.5 12 12l3-2 3 2" />
      <path d="M3 16.5c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" />
      <path d="M3 19.8c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" />
    </svg>
  );
}

const ICONS: Record<ActivityType, () => ReactElement> = {
  running: IconRunning,
  walking: IconWalking,
  cycling: IconCycling,
  basketball: IconBasketball,
  football: IconFootball,
  padel: IconPadel,
  badminton: IconBadminton,
  gym: IconGym,
  yoga: IconYoga,
  swimming: IconSwimming,
};

export function ActivityIcon({
  type,
  className,
}: {
  type: ActivityType;
  className?: string;
}) {
  const Icon = ICONS[type];
  return (
    <span className={cn("inline-flex", className)}>
      <Icon />
    </span>
  );
}
