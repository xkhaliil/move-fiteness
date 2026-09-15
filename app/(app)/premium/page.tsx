import { getCurrentUser } from "@/lib/session";
import { upgradeToPremium } from "@/lib/actions/premium";
import { Button } from "@/components/ui/Button";
import { TopBar } from "@/components/ui/TopBar";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 10.5 8 14.5 16 6" />
    </svg>
  );
}

const PERKS = [
  {
    title: "Exact activity filters",
    body: "Search Padel specifically, not just \"Racket Sports\" — same for every type.",
  },
  {
    title: "Pace & level filters",
    body: "Beginner, intermediate, advanced — match with people training at your speed.",
  },
];

export default async function PremiumPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <TopBar title="Premium" backHref="/feed" />

      <div className="px-4 py-6 lg:mx-auto lg:max-w-3xl lg:px-8 lg:py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Premium
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-text lg:text-4xl">
          Stop matching with people who aren&apos;t at your level.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-text-muted lg:text-base">
          Everything else on MOVE! stays free, forever — posting, joining, rating.
          Premium only sharpens who shows up in your feed.
        </p>

        <div className="mt-6 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="flex gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <CheckIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-text">{perk.title}</p>
                <p className="mt-0.5 text-sm text-text-muted">{perk.body}</p>
              </div>
            </div>
          ))}
        </div>

        {user.isPremium ? (
          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-center text-sm font-semibold text-accent lg:max-w-sm">
            You&apos;re already Premium
          </div>
        ) : (
          <form action={upgradeToPremium} className="mt-8 lg:max-w-sm">
            <Button type="submit" size="lg" className="w-full">
              Upgrade now
            </Button>
            <p className="mt-2 text-center text-xs text-text-muted">
              Demo mode — no payment required.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
