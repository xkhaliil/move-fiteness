import { getCurrentUser } from "@/lib/session";
import {
  getActivities,
  getHeadcount,
  getUserById,
  isActivityPast,
} from "@/lib/store";
import {
  ACTIVITY_CATEGORY_BY_TYPE,
  ACTIVITY_CATEGORY_LABEL,
  type ActivityCategory,
} from "@/lib/types";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { ChipLink, LockedChip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

const CATEGORIES = Object.keys(ACTIVITY_CATEGORY_LABEL) as ActivityCategory[];

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const user = await getCurrentUser();
  if (!user) return null;

  const upcoming = getActivities()
    .filter((a) => !isActivityPast(a))
    .filter((a) =>
      category ? ACTIVITY_CATEGORY_BY_TYPE[a.type] === category : true
    )
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <div>
      <div className="sticky top-0 z-30 space-y-3 border-b border-border bg-bg/95 px-4 pb-3 pt-6 backdrop-blur lg:space-y-4 lg:px-8 lg:pb-4 lg:pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted lg:text-sm">Hey {user.name.split(" ")[0]},</p>
            <h1 className="font-display text-xl text-text lg:text-2xl">Move today</h1>
          </div>
          {!user.isPremium && (
            <LinkButton href="/premium" variant="secondary" size="sm">
              Upgrade
            </LinkButton>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <ChipLink href="/feed" active={!category}>
            All
          </ChipLink>
          {CATEGORIES.map((c) => (
            <ChipLink key={c} href={`/feed?category=${c}`} active={category === c}>
              {ACTIVITY_CATEGORY_LABEL[c]}
            </ChipLink>
          ))}
          <LockedChip href="/premium">Level & type</LockedChip>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 py-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8 lg:py-6 xl:grid-cols-3">
        {upcoming.length === 0 ? (
          <EmptyState
            className="lg:col-span-full"
            title="No activities near you yet"
            description="Be the first to post one — someone nearby is probably looking for exactly this."
            action={
              <LinkButton href="/activities/new" size="sm">
                Post an activity
              </LinkButton>
            }
          />
        ) : (
          upcoming.map((activity) => {
            const host = getUserById(activity.hostId);
            if (!host) return null;
            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                host={host}
                headcount={getHeadcount(activity.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
