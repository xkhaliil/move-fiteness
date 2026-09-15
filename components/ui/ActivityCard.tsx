import Link from "next/link";
import type { Activity, User } from "@/lib/types";
import { ACTIVITY_TYPE_LABEL } from "@/lib/types";
import { ratingAverage } from "@/lib/store";
import { formatActivityDateTime } from "@/lib/format";
import { ActivityIcon } from "./ActivityIcon";
import { Avatar } from "./Avatar";
import { RatingBadge } from "./RatingBadge";

export function ActivityCard({
  activity,
  host,
  headcount,
}: {
  activity: Activity;
  host: User;
  headcount: number;
}) {
  const isFull = headcount >= activity.capacity;

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition active:scale-[0.98] active:bg-surface-raised"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-secondary/15 text-accent-secondary">
            <ActivityIcon type={activity.type} className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="text-xs font-medium text-accent-secondary">
              {ACTIVITY_TYPE_LABEL[activity.type]}
            </p>
            <p className="text-xs text-text-muted">{activity.neighborhood}</p>
          </div>
        </div>
        <span className="text-xs font-medium text-text-muted whitespace-nowrap">
          {formatActivityDateTime(activity.dateTime)}
        </span>
      </div>

      <h3 className="mt-3 font-display text-lg leading-tight text-text">
        {activity.title}
      </h3>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <Avatar name={host.name} size="sm" />
          <div>
            <p className="text-xs font-medium text-text">{host.name}</p>
            <RatingBadge
              average={ratingAverage(host)}
              count={host.ratingCount}
              size="sm"
              showCount={false}
            />
          </div>
        </div>
        <span
          className={
            isFull
              ? "rounded-full bg-surface-raised px-2.5 py-1 text-xs font-semibold text-text-muted"
              : "rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent"
          }
        >
          {isFull ? "Full" : `${headcount} going`}
        </span>
      </div>
    </Link>
  );
}
