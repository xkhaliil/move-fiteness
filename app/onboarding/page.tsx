import { redirect } from "next/navigation";
import { completeOnboarding } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/session";
import { ACTIVITY_TYPE_LABEL, type ActivityType } from "@/lib/types";
import { ActivityIcon } from "@/components/ui/ActivityIcon";
import { Button } from "@/components/ui/Button";

const TYPES = Object.keys(ACTIVITY_TYPE_LABEL) as ActivityType[];

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/feed");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10 lg:min-h-0 lg:my-16 lg:max-w-lg lg:rounded-3xl lg:border lg:border-border lg:bg-surface lg:px-12 lg:py-12 lg:shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)]">
      <span className="font-display text-lg text-text">
        MOVE<span className="text-accent">!</span>
      </span>

      <h1 className="mt-6 font-display text-3xl leading-tight text-text lg:text-4xl">
        New in town?
        <br />
        Find your people
        <br />
        through movement.
      </h1>
      <p className="mt-3 text-sm text-text-muted lg:text-base">
        Tell us a little about you — this takes ten seconds.
      </p>

      <form action={completeOnboarding} className="mt-8 flex flex-1 flex-col gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Your name</span>
          <input
            name="name"
            required
            placeholder="Alex"
            className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-text placeholder:text-text-muted focus:border-accent-secondary focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">City</span>
          <input
            name="city"
            defaultValue="Barcelona"
            className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-text focus:border-accent-secondary focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-text-muted">
            What do you want to do more of? (pick up to 3)
          </span>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={type}
                  className="sr-only"
                />
                <ActivityIcon type={type} className="h-4 w-4" />
                {ACTIVITY_TYPE_LABEL[type]}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-auto w-full">
          Start moving
        </Button>
      </form>
    </div>
  );
}
