import Link from "next/link";
import type { User } from "@/lib/types";
import {
  getActivities,
  getActivityById,
  getHeadcount,
  getJoinRequestsForUser,
  getUserById,
  ratingAverage,
} from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { LinkButton } from "@/components/ui/Button";

export function ProfileContent({
  profileUser,
  isOwn,
}: {
  profileUser: User;
  isOwn: boolean;
}) {
  const hosted = getActivities().filter((a) => a.hostId === profileUser.id);
  const joinedActivityIds = getJoinRequestsForUser(profileUser.id)
    .filter((r) => r.status === "approved")
    .map((r) => r.activityId)
    .filter((activityId) => getActivityById(activityId)?.hostId !== profileUser.id);

  return (
    <div className="px-4 py-6 lg:mx-auto lg:max-w-4xl lg:px-8 lg:py-8">
      <div className="flex items-center gap-4 lg:gap-6">
        <Avatar name={profileUser.name} size="lg" className="lg:h-24 lg:w-24 lg:text-3xl" />
        <div>
          <h1 className="font-display text-xl text-text lg:text-3xl">{profileUser.name}</h1>
          <p className="text-sm text-text-muted lg:text-base">{profileUser.city}</p>
          <div className="mt-1">
            <RatingBadge
              average={ratingAverage(profileUser)}
              count={profileUser.ratingCount}
            />
          </div>
        </div>
      </div>

      {profileUser.bio && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted lg:text-base">
          {profileUser.bio}
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 lg:max-w-sm">
        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
          <p className="font-display text-lg text-text">{hosted.length}</p>
          <p className="text-xs text-text-muted">Hosted</p>
        </div>
        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
          <p className="font-display text-lg text-text">{joinedActivityIds.length}</p>
          <p className="text-xs text-text-muted">Joined</p>
        </div>
      </div>

      {isOwn && (
        <div className="mt-4 flex gap-2 lg:max-w-sm">
          <LinkButton href="/settings" variant="secondary" size="sm" className="flex-1">
            Settings
          </LinkButton>
          {!profileUser.isPremium && (
            <LinkButton href="/premium" size="sm" className="flex-1">
              Go Premium
            </LinkButton>
          )}
        </div>
      )}

      {hosted.length > 0 && (
        <section className="mt-7">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Hosting
          </h2>
          <div className="mt-3 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
            {hosted.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                host={profileUser}
                headcount={getHeadcount(activity.id)}
              />
            ))}
          </div>
        </section>
      )}

      {joinedActivityIds.length > 0 && (
        <section className="mt-7">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Joined
          </h2>
          <div className="mt-3 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
            {joinedActivityIds.map((activityId) => {
              const activity = getActivityById(activityId);
              if (!activity) return null;
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
            })}
          </div>
        </section>
      )}

      {!isOwn && (
        <p className="mt-8 text-center text-xs text-text-muted">
          <Link href="/feed" className="underline">
            Back to feed
          </Link>
        </p>
      )}
    </div>
  );
}
