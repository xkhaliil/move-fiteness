import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getActivityById, getUserById, isActivityPast } from "@/lib/store";
import { getPeopleToRate } from "@/lib/notifications";
import { submitRating } from "@/lib/actions/ratings";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import { TopBar } from "@/components/ui/TopBar";
import { EmptyState } from "@/components/ui/EmptyState";

const TAGS: Array<{ value: string; label: string }> = [
  { value: "great-vibe", label: "Great vibe" },
  { value: "good-pace", label: "Good pace" },
  { value: "no-show", label: "No-show" },
];

export default async function RateActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivityById(id);
  if (!activity || !isActivityPast(activity)) notFound();

  const user = await getCurrentUser();
  if (!user) return null;

  const rateeIds = await getPeopleToRate(user.id, activity!.id);

  return (
    <div>
      <TopBar title="Rate the session" backHref={`/activities/${id}`} />

      <div className="flex flex-col gap-4 px-4 py-5 lg:mx-auto lg:max-w-xl lg:px-8 lg:py-8">
        <p className="text-sm text-text-muted lg:text-base">
          Ratings are anonymous — {activity!.title} won&apos;t know who left what.
        </p>

        {rateeIds.length === 0 ? (
          <EmptyState
            title="You're all caught up"
            description="Thanks for the feedback — it helps keep MOVE! trustworthy."
          />
        ) : (
          await Promise.all(rateeIds.map(async (rateeId) => {
            const ratee = await getUserById(rateeId);
            if (!ratee) return null;
            return (
              <form
                key={rateeId}
                action={submitRating}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4"
              >
                <input type="hidden" name="activityId" value={activity!.id} />
                <input type="hidden" name="rateeId" value={rateeId} />

                <div className="flex items-center gap-3">
                  <Avatar name={ratee.name} size="md" />
                  <p className="text-sm font-semibold text-text">{ratee.name}</p>
                </div>

                <StarRatingInput />

                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <label
                      key={tag.value}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-xs text-text-muted has-[:checked]:border-accent has-[:checked]:text-accent"
                    >
                      <input
                        type="radio"
                        name="tag"
                        value={tag.value}
                        className="sr-only"
                      />
                      {tag.label}
                    </label>
                  ))}
                </div>

                <Button type="submit" size="md" className="w-full">
                  Submit rating
                </Button>
              </form>
            );
          }))
        )}
      </div>
    </div>
  );
}
