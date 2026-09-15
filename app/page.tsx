import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { TEAM } from "@/lib/team";
import { Avatar } from "@/components/ui/Avatar";
import { RatingBadge } from "@/components/ui/RatingBadge";
import Image from "next/image";
import RuningMan from "@/public/man-running-red-wall.jpg";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#plans", label: "Plans" },
  { href: "#team", label: "Team" },
];

const STEPS = [
  {
    title: "Post it, or find it",
    body: "Pick an activity, a time, and a spot to meet. Or just scroll the feed and join something that's already happening nearby.",
  },
  {
    title: "Match with people",
    body: "Whoever's interested hits request. You decide who actually comes, so it doesn't turn into a random crowd.",
  },
  {
    title: "Show up and move",
    body: "The meeting spot's already set. After that it's just you, some other people, and being outside.",
  },
  {
    title: "Rate it afterwards",
    body: "Leave an anonymous rating. Do that enough times and the reliable people stand out while the flakes sort themselves out.",
  },
];

const FAQS = [
  {
    q: "Does it cost anything to join?",
    a: "Nope. Posting, joining, and rating people afterward are all free and staying free. Premium just adds filters.",
  },
  {
    q: "How do I know people are actually who they say they are?",
    a: "Every host and guest builds a visible rating from past meetups, so you can check someone's score before you commit to joining. Flaky or no-show behavior gets tagged and follows their profile.",
  },
  {
    q: "What happens if someone doesn't show up?",
    a: "You rate them 1-5 stars afterwards, anonymously, so there's no awkward conversation about it. Ratings show up on profiles, which keeps most people honest before you even meet.",
  },
  {
    q: "Do I need to be fit or competitive?",
    a: "Not even a little. Plenty of activities are a chill walk or a beginner session, and every post says what level it's for. Tight skill-level filtering is a Premium feature, not a requirement.",
  },
  {
    q: "Is it only for team sports?",
    a: "Not at all. Pickup games, runs, hikes, gym sessions — whatever you're into. Post it or join one, works the same way.",
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 11l4 4 8-9" />
    </svg>
  );
}

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <a href="#top" className="font-display text-lg text-text">
            MOVE<span className="text-accent">!</span>
          </a>
          <nav className="ml-auto hidden gap-6 text-sm font-medium text-text-muted sm:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-text"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Link
            href="/onboarding"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink transition hover:brightness-95 active:scale-[0.98] sm:ml-0"
          >
            Get started
          </Link>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-56 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[110px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-accent-secondary/10 blur-[110px]"
          />

          <div className="relative mx-auto max-w-5xl px-6 py-12 sm:py-20">
            <div className="grid gap-10 sm:grid-cols-2 sm:items-center sm:gap-16">
              <div>
                <h1 className="font-display text-4xl leading-[1.05] text-text sm:text-6xl">
                  Find someone
                  <br />
                  to <span className="text-accent">move</span> with.
                </h1>
                <p className="mt-5 max-w-sm text-base text-text-muted sm:text-lg">
                  Post what you want to do, match with people near you who are
                  down for the same thing, then actually go do it. That&apos;s
                  it, that&apos;s the app.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/onboarding"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-ink transition hover:brightness-95 active:scale-[0.98]"
                  >
                    Get started
                  </Link>
                  <a
                    href="#how"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-text transition hover:bg-surface-raised active:scale-[0.98]"
                  >
                    How it works
                  </a>
                </div>
              </div>

              {/* The "aha moment" card */}
              <div className="relative">
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-secondary/15 text-lg font-display text-accent-secondary">
                      <Image
                        src={RuningMan}
                        alt=""
                        width={210}
                        height={210}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    </span>
                    <div>
                      <p className="font-display text-base text-text">
                        Morning trail run
                      </p>
                      <p className="text-xs text-text-muted">Saturday, 7:00</p>
                    </div>
                    <span className="ml-auto shrink-0 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">
                      Open
                    </span>
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {["Running", "Easy pace", "2.4 km away"].map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-border bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-text-muted">Where</span>
                      <span className="text-text">Riverside loop</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-text-muted">Distance</span>
                      <span className="text-text">8 km</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-text-muted">Pace</span>
                      <span className="text-text">
                        Easy, we talk the whole way
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-text-muted">Host rating</span>
                      <RatingBadge
                        average={4.8}
                        count={31}
                        size="sm"
                        showCount={false}
                      />
                    </li>
                  </ul>

                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-border">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-accent-secondary to-accent" />
                  </div>

                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex -space-x-2">
                      <Avatar
                        name="Marta"
                        size="sm"
                        className="border-2 border-surface"
                      />
                      <Avatar
                        name="Kofi"
                        size="sm"
                        className="border-2 border-surface"
                      />
                      <Avatar
                        name="Toni"
                        size="sm"
                        className="border-2 border-surface"
                      />
                    </div>
                    <p className="text-xs text-text-muted">
                      3 going, 1 spot left
                    </p>
                    <span className="ml-auto inline-flex h-8 items-center justify-center rounded-full bg-accent px-3.5 text-xs font-semibold text-accent-ink">
                      Join
                    </span>
                  </div>
                </div>

                <div className="animate-float absolute -bottom-6 left-3 hidden items-center gap-2.5 rounded-xl border border-border bg-surface-raised px-3.5 py-3 shadow-[0_26px_50px_-24px_rgba(0,0,0,0.9)] sm:flex">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(198,255,77,0.5)]"
                    aria-hidden
                  />
                  <div className="text-xs leading-tight">
                    <p className="font-semibold text-text">Kathe wants in</p>
                    <p className="text-text-muted">4.9 rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b border-border">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 sm:grid-cols-[1fr_1.4fr] sm:gap-16 sm:py-20">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
                How it works
              </p>
              <h2 className="font-display text-2xl leading-tight text-text sm:text-3xl">
                Four steps,
                <br />
                no friction.
              </h2>
            </div>
            <ol className="relative before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-gradient-to-b before:from-accent before:via-border before:to-transparent">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="relative flex gap-5 pb-9 pl-14 last:pb-0"
                >
                  <span className="absolute left-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text">{step.title}</h3>
                    <p className="mt-1 max-w-xl text-sm text-text-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pricing */}
        <section id="plans" className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Plans
            </p>
            <h2 className="font-display text-2xl leading-tight text-text sm:text-3xl">
              Free to use.
              <br />
              Premium if you want more.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display text-lg text-text">Free</h3>
                <p className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl text-text">$0</span>
                  <span className="text-xs text-text-muted">forever</span>
                </p>
                <p className="mt-3 text-sm text-text-muted">
                  Everything you actually need to meet people and go do
                  something.
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm text-text">
                  {[
                    "Post your own activities",
                    "Join activities near you",
                    "See what's happening around you",
                    "Anonymous ratings after every session",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
                <h3 className="font-display text-lg text-text">Premium</h3>
                <p className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl text-text">$4.99</span>
                  <span className="text-xs text-text-muted">/ month</span>
                </p>
                <p className="mt-3 text-sm text-text-muted">
                  For when you&apos;re picky about who and what you train with.
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-accent/20 pt-5 text-sm text-text">
                  {[
                    "Everything in Free",
                    "Exact activity filters",
                    "Pace & level filters",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-5 text-sm text-text-muted">
              No commitment — upgrade or cancel anytime from Settings.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Questions
            </p>
            <h2 className="font-display text-2xl text-text sm:text-3xl">
              Good to know.
            </h2>
            <div className="mt-6 divide-y divide-border border-t border-border">
              {FAQS.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-text transition group-hover:text-accent">
                    {item.q}
                    <span className="shrink-0 text-accent transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm text-text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              The team
            </p>
            <h2 className="font-display text-2xl leading-tight text-text sm:text-3xl">
              Built by people
              <br />
              who kept going alone.
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-8 text-center transition hover:-translate-y-1 hover:border-accent/40 hover:bg-surface-raised"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border sm:h-24 sm:w-24">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 640px) 96px, 80px"
                      className="object-cover"
                      style={
                        member.photoZoom
                          ? {
                              transform: `translate(${member.photoOffsetX ?? 0}px, ${member.photoOffsetY ?? 0}px) scale(${member.photoZoom})`,
                            }
                          : undefined
                      }
                    />
                  </div>
                  <div>
                    <p className="font-display text-base text-text">
                      {member.name}
                    </p>
                    <p className="mt-1.5 inline-block rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <div className="mx-auto max-w-2xl px-6 py-12 text-center sm:py-20">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-12 sm:px-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-40 left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]"
              />
              <div className="relative">
                <h2 className="font-display text-2xl text-text sm:text-3xl">
                  Turn &ldquo;I want to&rdquo; into &ldquo;Let&apos;s go!&rdquo;
                </h2>
                <p className="mt-3 text-sm text-text-muted">
                  Tell us what you&apos;re into and you&apos;re in — takes about
                  ten seconds, no waitlist.
                </p>
                <div className="mt-8">
                  <Link
                    href="/onboarding"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-accent-ink transition hover:brightness-95 active:scale-[0.98]"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr]">
            <div>
              <a href="#top" className="font-display text-lg text-text">
                MOVE<span className="text-accent">!</span>
              </a>
              <p className="mt-3 max-w-xs text-sm text-text-muted">
                Find someone to move with. Post it, match, show up.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text">
                Product
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-text-muted transition hover:text-accent"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/onboarding"
                    className="text-text-muted transition hover:text-accent"
                  >
                    Get started
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-text-muted">
            <span>&copy; {new Date().getFullYear()} MOVE!</span>
            <span>Made for people who&apos;d rather not go alone.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
