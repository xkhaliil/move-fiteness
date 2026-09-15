import { randomUUID } from "node:crypto";
import { cache } from "react";
import { Redis } from "@upstash/redis";
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

function nextId(prefix: string): string {
  return `${prefix}-${randomUUID()}`;
}

// --- Persistence backend ---
//
// This app's whole dataset is small, so it's persisted as a single JSON
// blob in Redis (works with either the "Vercel KV" or Marketplace
// "Upstash" Redis integration — both inject env vars under one of the
// names below). Without those env vars (e.g. local `next dev`), it falls
// back to a plain in-memory global, matching the previous behavior.
//
// This is a single-document store with no transactional locking: two
// writes racing at the exact same instant can clobber each other. Fine
// for this app's traffic; a real production app would want per-entity
// keys or optimistic locking instead.

const STORE_KEY = "move:store:v1";

function readRedisEnv(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

const redis = (() => {
  const env = readRedisEnv();
  return env ? new Redis({ url: env.url, token: env.token }) : null;
})();

const getStore = cache(async (): Promise<Store> => {
  if (redis) {
    const existing = await redis.get<Store>(STORE_KEY);
    if (existing) return existing;
    const fresh = buildStore();
    await redis.set(STORE_KEY, fresh);
    return fresh;
  }

  if (!global.__moveStore) {
    global.__moveStore = buildStore();
  }
  // Dev-time HMR can keep a stale singleton around after the Store shape
  // changes; backfill any fields that predate the cached instance.
  global.__moveStore.waitlist ??= [];
  return global.__moveStore;
});

async function persistStore(store: Store): Promise<void> {
  if (redis) {
    await redis.set(STORE_KEY, store);
  }
  // In-memory fallback: `store` already *is* `global.__moveStore` (same
  // reference), so the mutation is already visible — nothing else to do.
}

// --- Users ---

export async function getUsers(): Promise<User[]> {
  return (await getStore()).users;
}

export async function getUserById(id: string): Promise<User | undefined> {
  return (await getStore()).users.find((u) => u.id === id);
}

export async function createUser(input: {
  name: string;
  city: string;
  interests: User["interests"];
  bio?: string;
}): Promise<User> {
  const store = await getStore();
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
  store.users.push(user);
  await persistStore(store);
  return user;
}

export async function setUserPremium(
  userId: string,
  isPremium: boolean
): Promise<void> {
  const store = await getStore();
  const user = store.users.find((u) => u.id === userId);
  if (user) {
    user.isPremium = isPremium;
    await persistStore(store);
  }
}

export function ratingAverage(user: Pick<User, "ratingSum" | "ratingCount">): number | null {
  if (user.ratingCount === 0) return null;
  return user.ratingSum / user.ratingCount;
}

// --- Activities ---

export async function getActivities(): Promise<Activity[]> {
  return (await getStore()).activities;
}

export async function getActivityById(id: string): Promise<Activity | undefined> {
  return (await getStore()).activities.find((a) => a.id === id);
}

export async function createActivity(
  input: Omit<Activity, "id" | "createdAt">
): Promise<Activity> {
  const store = await getStore();
  const activity: Activity = {
    ...input,
    id: nextId("a"),
    createdAt: new Date().toISOString(),
  };
  store.activities.push(activity);
  await persistStore(store);
  return activity;
}

export function isActivityPast(activity: Activity): boolean {
  return new Date(activity.dateTime).getTime() < Date.now();
}

// --- Join requests ---

export async function getJoinRequestsForActivity(activityId: string): Promise<JoinRequest[]> {
  return (await getStore()).joinRequests.filter((r) => r.activityId === activityId);
}

export async function getJoinRequestsForUser(userId: string): Promise<JoinRequest[]> {
  return (await getStore()).joinRequests.filter((r) => r.userId === userId);
}

export async function getJoinRequest(
  activityId: string,
  userId: string
): Promise<JoinRequest | undefined> {
  return (await getStore()).joinRequests.find(
    (r) => r.activityId === activityId && r.userId === userId
  );
}

export async function getJoinRequestById(id: string): Promise<JoinRequest | undefined> {
  return (await getStore()).joinRequests.find((r) => r.id === id);
}

export async function createJoinRequest(
  activityId: string,
  userId: string,
  status: JoinRequestStatus = "pending"
): Promise<JoinRequest> {
  const store = await getStore();
  const request: JoinRequest = {
    id: nextId("jr"),
    activityId,
    userId,
    status,
    requestedAt: new Date().toISOString(),
  };
  store.joinRequests.push(request);
  await persistStore(store);
  return request;
}

export async function setJoinRequestStatus(
  id: string,
  status: JoinRequestStatus
): Promise<JoinRequest | undefined> {
  const store = await getStore();
  const request = store.joinRequests.find((r) => r.id === id);
  if (request) {
    request.status = status;
    await persistStore(store);
  }
  return request;
}

export async function getApprovedParticipantIds(activityId: string): Promise<string[]> {
  return (await getJoinRequestsForActivity(activityId))
    .filter((r) => r.status === "approved")
    .map((r) => r.userId);
}

export async function getHeadcount(activityId: string): Promise<number> {
  return (await getApprovedParticipantIds(activityId)).length;
}

// --- Ratings ---

export async function hasRated(
  activityId: string,
  raterId: string,
  rateeId: string
): Promise<boolean> {
  return (await getStore()).ratings.some(
    (r) => r.activityId === activityId && r.raterId === raterId && r.rateeId === rateeId
  );
}

export async function createRating(input: {
  activityId: string;
  raterId: string;
  rateeId: string;
  score: number;
  tag: RatingTag;
}): Promise<Rating> {
  const store = await getStore();
  const rating: Rating = {
    id: nextId("r"),
    ...input,
    createdAt: new Date().toISOString(),
  };
  store.ratings.push(rating);

  const ratee = store.users.find((u) => u.id === input.rateeId);
  if (ratee) {
    ratee.ratingSum += input.score;
    ratee.ratingCount += 1;
  }

  await persistStore(store);
  return rating;
}

// --- Notifications ---

export async function createNotification(
  userId: string,
  type: NotificationType,
  activityId: string
): Promise<Notification> {
  const store = await getStore();
  const notification: Notification = {
    id: nextId("n"),
    userId,
    type,
    activityId,
    read: false,
    createdAt: new Date().toISOString(),
  };
  store.notifications.push(notification);
  await persistStore(store);
  return notification;
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  return (await getStore()).notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationRead(id: string): Promise<void> {
  const store = await getStore();
  const notification = store.notifications.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
    await persistStore(store);
  }
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const store = await getStore();
  let changed = false;
  for (const n of store.notifications) {
    if (n.userId === userId && !n.read) {
      n.read = true;
      changed = true;
    }
  }
  if (changed) {
    await persistStore(store);
  }
}

// --- Waitlist ---

export async function addToWaitlist(email: string): Promise<{ alreadyJoined: boolean }> {
  const normalized = email.trim().toLowerCase();
  const store = await getStore();
  const existing = store.waitlist.find((w) => w.email.toLowerCase() === normalized);
  if (existing) return { alreadyJoined: true };

  store.waitlist.push({
    id: nextId("wl"),
    email: email.trim(),
    joinedAt: new Date().toISOString(),
  });
  await persistStore(store);
  return { alreadyJoined: false };
}
