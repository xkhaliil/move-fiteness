import { cn } from "@/lib/cn";

const PALETTE = [
  "bg-[#2A2F35] text-[#C6FF4D]",
  "bg-[#2A2F35] text-[#35D0E8]",
  "bg-[#242832] text-[#F5F6F7]",
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return hash;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const SIZES = {
  sm: "h-7 w-7 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl",
};

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const palette = PALETTE[hashName(name) % PALETTE.length];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        SIZES[size],
        palette,
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
