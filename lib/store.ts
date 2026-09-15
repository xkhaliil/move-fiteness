import type {
  Activity,
  JoinRequest,
  JoinRequestStatus,
  Notification,
  NotificationType,
  Rating,
  RatingTag,
  User,
} from "./types";
import {
  createSeedActivities,
  createSeedApprovedParticipants,
  createSeedUsers,
} from "./seed-data";

interface WaitlistEntry {
  id: string;
  email: string;
  joinedAt: string;
}

interface Store {
  users: User[];
  activities: Activity[];
  joinRequests: JoinRequest[];
  ratings: Rating[];
  notifications: Notification[];
  waitlist: WaitlistEntry[];
}

declare global {
  var __moveStore: Store | undefined;
}

function buildStore(): Store {
  const users = createSeedUsers();
  const activities = createSeedActivities();
  const approvedParticipants = createSeedApprovedParticipants();

  const joinRequests: JoinRequest[] = [];
  let seq = 0;
  for (const activity of activities) {
    const approvedIds = approvedParticipants[activity.id] ?? [];
    for (const userId of approvedIds) {
      seq += 1;
      joinRequests.push({
        id: `jr-seed-${seq}`,
        activityId: activity.id,
        userId,
        status: "approved",
        requestedAt: activity.createdAt,
      });
    }
  }

  return {
    users,
    activities,
    joinRequests,
    ratings: [],
    notifications: [],
    waitlist: [],
  };
}

function getStore(): Store {
  if (!global.__moveStore) {
    global.__moveStore = buildStore();
  }
  // Dev-time HMR can keep a stale singleton around after the Store shape
  // changes; backfill any fields that predate the cached instance.
  global.__moveStore.waitlist ??= [];
  return global.__moveStore;
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

// --- Users ---

export function getUsers(): User[] {
  return getStore().users;
}

export function getUserById(id: string): User | undefined {
  return getStore().users.find((u) => u.id === id);
}

export function createUser(input: {
  name: string;
  city: string;
  interests: User["interests"];
  bio?: string;
}): User {
  const user: User = {
    id: nextId("u"),
    name: input.name,
    city: input.city,
    interests: input.interests,
    bio: input.bio ?? "",
    isPremium: false,
    ratingSum: 0,
    ratingCount: 0,
    createdAt: new Date().toISOString(),
  };
  getStore().users.push(user);
  return user;
}

export function setUserPremium(userId: string, isPremium: boolean): void {
  const user = getUserById(userId);
  if (user) user.isPremium = isPremium;
}

export function ratingAverage(user: Pick<User, "ratingSum" | "ratingCount">): number | null {
  if (user.ratingCount === 0) return null;
  return user.ratingSum / user.ratingCount;
}

// --- Activities ---

export function getActivities(): Activity[] {
  return getStore().activities;
}

export function getActivityById(id: string): Activity | undefined {
  return getStore().activities.find((a) => a.id === id);
}

export function createActivity(input: Omit<Activity, "id" | "createdAt">): Activity {
  const activity: Activity = {
    ...input,
    id: nextId("a"),
    createdAt: new Date().toISOString(),
  };
  getStore().activities.push(activity);
  return activity;
}

export function isActivityPast(activity: Activity): boolean {
  return new Date(activity.dateTime).getTime() < Date.now();
}

// --- Join requests ---

export function getJoinRequestsForActivity(activityId: string): JoinRequest[] {
  return getStore().joinRequests.filter((r) => r.activityId === activityId);
}

export function getJoinRequestsForUser(userId: string): JoinRequest[] {
  return getStore().joinRequests.filter((r) => r.userId === userId);
}

export function getJoinRequest(activityId: string, userId: string): JoinRequest | undefined {
  return getStore().joinRequests.find(
    (r) => r.activityId === activityId && r.userId === userId
  );
}

export function getJoinRequestById(id: string): JoinRequest | undefined {
  return getStore().joinRequests.find((r) => r.id === id);
}

export function createJoinRequest(
  activityId: string,
  userId: string,
  status: JoinRequestStatus = "pending"
): JoinRequest {
  const request: JoinRequest = {
    id: nextId("jr"),
    activityId,
    userId,
    status,
    requestedAt: new Date().toISOString(),
  };
  getStore().joinRequests.push(request);
  return request;
}

export function setJoinRequestStatus(id: string, status: JoinRequestStatus): JoinRequest | undefined {
  const request = getJoinRequestById(id);
  if (request) request.status = status;
  return request;
}

export function getApprovedParticipantIds(activityId: string): string[] {
  return getJoinRequestsForActivity(activityId)
    .filter((r) => r.status === "approved")
    .map((r) => r.userId);
}

export function getHeadcount(activityId: string): number {
  return getApprovedParticipantIds(activityId).length;
}

// --- Ratings ---

export function hasRated(activityId: string, raterId: string, rateeId: string): boolean {
  return getStore().ratings.some(
    (r) => r.activityId === activityId && r.raterId === raterId && r.rateeId === rateeId
  );
}

export function createRating(input: {
  activityId: string;
  raterId: string;
  rateeId: string;
  score: number;
  tag: RatingTag;
}): Rating {
  const rating: Rating = {
    id: nextId("r"),
    ...input,
    createdAt: new Date().toISOString(),
  };
  getStore().ratings.push(rating);

  const ratee = getUserById(input.rateeId);
  if (ratee) {
    ratee.ratingSum += input.score;
    ratee.ratingCount += 1;
  }

  return rating;
}

// --- Notifications ---

export function createNotification(
  userId: string,
  type: NotificationType,
  activityId: string
): Notification {
  const notification: Notification = {
    id: nextId("n"),
    userId,
    type,
    activityId,
    read: false,
    createdAt: new Date().toISOString(),
  };
  getStore().notifications.push(notification);
  return notification;
}

export function getNotificationsForUser(userId: string): Notification[] {
  return getStore()
    .notifications.filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markNotificationRead(id: string): void {
  const notification = getStore().notifications.find((n) => n.id === id);
  if (notification) notification.read = true;
}

export function markAllNotificationsRead(userId: string): void {
  for (const n of getStore().notifications) {
    if (n.userId === userId) n.read = true;
  }
}

// --- Waitlist ---

export function addToWaitlist(email: string): { alreadyJoined: boolean } {
  const normalized = email.trim().toLowerCase();
  const existing = getStore().waitlist.find(
    (w) => w.email.toLowerCase() === normalized
  );
  if (existing) return { alreadyJoined: true };

  getStore().waitlist.push({
    id: nextId("wl"),
    email: email.trim(),
    joinedAt: new Date().toISOString(),
  });
  return { alreadyJoined: false };
}
