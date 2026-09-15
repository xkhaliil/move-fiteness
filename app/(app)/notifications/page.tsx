import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getFeedNotifications, type FeedNotification } from "@/lib/notifications";
import { getActivityById } from "@/lib/store";
import { TopBar } from "@/components/ui/TopBar";
import { EmptyState } from "@/components/ui/EmptyState";

function describeNotification(
  n: FeedNotification,
  activityTitle: string
): { text: string; href: string } {
  switch (n.type) {
    case "join_request":
      return {
        text: `New request to join "${activityTitle}"`,
        href: `/activities/${n.activityId}/requests`,
      };
    case "request_approved":
      return {
        text: `You're confirmed for "${activityTitle}"`,
        href: `/activities/${n.activityId}`,
      };
    case "reminder":
      return {
        text: `"${activityTitle}" starts soon`,
        href: `/activities/${n.activityId}`,
      };
    case "rating_prompt":
      return {
        text: `Rate your session: "${activityTitle}"`,
        href: `/activities/${n.activityId}/rate`,
      };
  }
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = getFeedNotifications(user.id);

  return (
    <div>
      <TopBar title="Notifications" />

      <div className="flex flex-col gap-2 px-4 py-5 lg:mx-auto lg:max-w-2xl lg:gap-3 lg:px-8 lg:py-8">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<BellIcon />}
            title="No notifications yet"
            description="Join or post an activity and updates will show up here."
          />
        ) : (
          notifications.map((n) => {
            const activity = getActivityById(n.activityId);
            if (!activity) return null;
            const { text, href } = describeNotification(n, activity.title);
            return (
              <Link
                key={n.id}
                href={href}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-3.5"
              >
                {!n.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                )}
                <p
                  className={
                    n.read
                      ? "ml-5 text-sm text-text-muted"
                      : "text-sm text-text"
                  }
                >
                  {text}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
