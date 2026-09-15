import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import {
  getActivityById,
  getApprovedParticipantIds,
  getJoinRequest,
  getJoinRequestsForActivity,
  getUserById,
  isActivityPast,
  ratingAverage,
} from "@/lib/store";
import { getPeopleToRate } from "@/lib/notifications";
import { ACTIVITY_TYPE_LABEL } from "@/lib/types";
import { formatActivityDateTime } from "@/lib/format";
import { requestToJoin } from "@/lib/actions/join-requests";
import { ActivityIcon } from "@/components/ui/ActivityIcon";
import { Avatar } from "@/components/ui/Avatar";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { Button, LinkButton } from "@/components/ui/Button";
import { TopBar } from "@/components/ui/TopBar";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivityById(id);
  if (!activity) notFound();

  const user = await getCurrentUser();
  if (!user) return null;

  const host = await getUserById(activity!.hostId);
  if (!host) notFound();

  const approvedIds = await getApprovedParticipantIds(activity!.id);
  const participants = (
    await Promise.all(approvedIds.map((pid) => getUserById(pid)))
  ).filter(Boolean);
  const past = isActivityPast(activity!);
  const isHost = activity!.hostId === user.id;
  const myRequest = await getJoinRequest(activity!.id, user.id);
  const isFull = approvedIds.length >= activity!.capacity;
  const pendingCount = (await getJoinRequestsForActivity(activity!.id)).filter(
    (r) => r.status === "pending"
  ).length;
  const peopleToRate = past ? await getPeopleToRate(user.id, activity!.id) : [];

  return (
    <div>
      <TopBar title={ACTIVITY_TYPE_LABEL[activity!.type]} backHref="/feed" />

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-12 lg:px-8 lg:py-8">
      <div className="px-4 py-5 lg:px-0 lg:py-0">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-secondary/15 text-accent-secondary">
            <ActivityIcon type={activity!.type} className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-accent-secondary">
              {ACTIVITY_TYPE_LABEL[activity!.type]}
            </p>
            <p className="text-xs text-text-muted">{activity!.neighborhood}</p>
          </div>
        </div>

        <h1 className="mt-4 font-display text-2xl leading-tight text-text">
          {activity!.title}
        </h1>

        <div className="mt-3 space-y-1.5 text-sm text-text-muted">
          <p>{formatActivityDateTime(activity!.dateTime)}</p>
          <p>{activity!.locationName}</p>
        </div>

        {activity!.description && (
          <p className="mt-4 text-sm leading-relaxed text-text">
            {activity!.description}
          </p>
        )}

        <Link
          href={`/profile/${host.id}`}
          className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
        >
          <Avatar name={host.name} size="md" />
          <div className="flex-1">
            <p className="text-xs text-text-muted">Hosted by</p>
            <p className="text-sm font-semibold text-text">{host.name}</p>
          </div>
          <RatingBadge average={ratingAverage(host)} count={host.ratingCount} />
        </Link>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text">
              {approvedIds.length} of {activity!.capacity} going
            </p>
            {isHost && pendingCount > 0 && (
              <span className="text-xs font-medium text-accent">
                {pendingCount} pending
              </span>
            )}
          </div>
          {participants.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {participants.map((p) =>
                p ? (
                  <Link
                    key={p.id}
                    href={`/profile/${p.id}`}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3"
                  >
                    <Avatar name={p.name} size="sm" />
                    <span className="text-xs text-text">{p.name.split(" ")[0]}</span>
                  </Link>
                ) : null
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-text-muted">
              No one confirmed yet — be the first to join.
            </p>
          )}
        </div>
      </div>

      <div className="sticky bottom-20 mx-4 mt-4 lg:sticky lg:top-24 lg:mx-0 lg:mt-0 lg:rounded-2xl lg:border lg:border-border lg:bg-surface lg:p-5">
        {isHost ? (
          <LinkButton href={`/activities/${activity!.id}/requests`} size="lg" className="w-full">
            Manage requests
            {pendingCount > 0 ? ` (${pendingCount})` : ""}
          </LinkButton>
        ) : past ? (
          peopleToRate.length > 0 ? (
            <LinkButton href={`/activities/${activity!.id}/rate`} size="lg" className="w-full">
              Rate this activity
            </LinkButton>
          ) : myRequest?.status === "approved" ? (
            <div className="rounded-full bg-surface-raised py-3.5 text-center text-sm font-semibold text-text-muted">
              Activity finished
            </div>
          ) : null
        ) : myRequest?.status === "approved" ? (
          <div className="rounded-full bg-accent/15 py-3.5 text-center text-sm font-semibold text-accent">
            You&apos;re in ✓
          </div>
        ) : myRequest?.status === "pending" ? (
          <div className="rounded-full bg-surface-raised py-3.5 text-center text-sm font-semibold text-text-muted">
            Request sent
          </div>
        ) : myRequest?.status === "declined" ? (
          <div className="rounded-full bg-surface-raised py-3.5 text-center text-sm font-semibold text-text-muted">
            Request declined
          </div>
        ) : isFull ? (
          <div className="rounded-full bg-surface-raised py-3.5 text-center text-sm font-semibold text-text-muted">
            Activity full
          </div>
        ) : (
          <form action={requestToJoin}>
            <input type="hidden" name="activityId" value={activity!.id} />
            <Button type="submit" size="lg" className="w-full">
              Request to join
            </Button>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}
