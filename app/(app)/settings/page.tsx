import { getCurrentUser } from "@/lib/session";
import { downgradeFromPremium } from "@/lib/actions/premium";
import { Button, LinkButton } from "@/components/ui/Button";
import { TopBar } from "@/components/ui/TopBar";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm font-medium text-text">{value}</span>
    </div>
  );
}

function ToggleRow({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-text">{label}</span>
      <input
        type="checkbox"
        defaultChecked
        className="h-5 w-9 shrink-0 appearance-none rounded-full bg-surface-raised outline-none transition before:block before:h-4 before:w-4 before:translate-x-0.5 before:translate-y-0.5 before:rounded-full before:bg-text-muted before:transition checked:bg-accent/30 checked:before:translate-x-4 checked:before:bg-accent"
      />
    </label>
  );
}

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <TopBar title="Settings" backHref="/profile" />

      <div className="flex flex-col gap-6 px-4 py-5 lg:mx-auto lg:max-w-3xl lg:grid lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-8">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Account
          </h2>
          <div className="mt-2 rounded-2xl border border-border bg-surface px-4">
            <Row label="Name" value={user.name} />
            <Row label="City" value={user.city} />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Notifications
          </h2>
          <div className="mt-2 rounded-2xl border border-border bg-surface px-4">
            <ToggleRow label="Join requests" />
            <ToggleRow label="Activity reminders" />
            <ToggleRow label="Rating prompts" />
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Subscription
          </h2>
          <div className="mt-2 rounded-2xl border border-border bg-surface p-4">
            <p className="text-sm text-text">
              {user.isPremium ? "You're on Premium" : "You're on the Free plan"}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Posting, joining, and rating are always free.
            </p>
            <div className="mt-3">
              {user.isPremium ? (
                <form action={downgradeFromPremium}>
                  <Button type="submit" variant="secondary" size="sm">
                    Cancel Premium
                  </Button>
                </form>
              ) : (
                <LinkButton href="/premium" size="sm">
                  Upgrade to Premium
                </LinkButton>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
