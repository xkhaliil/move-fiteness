import {
  getActivities,
  getActivityById,
  getApprovedParticipantIds,
  getNotificationsForUser,
  hasRated,
  isActivityPast,
} from "./store";

export type FeedNotificationType =
  | "join_request"
  | "request_approved"
  | "reminder"
  | "rating_prompt";

export interface FeedNotification {
  id: string;
  type: FeedNotificationType;
  activityId: string;
  createdAt: string;
  read: boolean;
}

const REMINDER_WINDOW_MS = 24 * 60 * 60 * 1000;

function peopleToRate(userId: string, activityId: string): string[] {
  const activity = getActivityById(activityId);
  if (!activity) return [];
  const approved = getApprovedParticipantIds(activityId);

  if (activity.hostId === userId) {
    return approved.filter((id) => !hasRated(activityId, userId, id));
  }
  if (approved.includes(userId)) {
    return hasRated(activityId, userId, activity.hostId) ? [] : [activity.hostId];
  }
  return [];
}

export function getFeedNotifications(userId: string): FeedNotification[] {
  const stored: FeedNotification[] = getNotificationsForUser(userId).map((n) => ({
    id: n.id,
    type: n.type,
    activityId: n.activityId,
    createdAt: n.createdAt,
    read: n.read,
  }));

  const synthesized: FeedNotification[] = [];
  const now = Date.now();

  for (const activity of getActivities()) {
    const approved = getApprovedParticipantIds(activity.id);
    const involved = activity.hostId === userId || approved.includes(userId);
    if (!involved) continue;

    if (!isActivityPast(activity)) {
      const msUntil = new Date(activity.dateTime).getTime() - now;
      if (msUntil >= 0 && msUntil <= REMINDER_WINDOW_MS) {
        synthesized.push({
          id: `reminder-${activity.id}`,
          type: "reminder",
          activityId: activity.id,
          createdAt: activity.dateTime,
          read: false,
        });
      }
    } else if (peopleToRate(userId, activity.id).length > 0) {
      synthesized.push({
        id: `rating-${activity.id}`,
        type: "rating_prompt",
        activityId: activity.id,
        createdAt: activity.dateTime,
        read: false,
      });
    }
  }

  return [...stored, ...synthesized].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPeopleToRate(userId: string, activityId: string): string[] {
  return peopleToRate(userId, activityId);
}
