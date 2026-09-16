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
  version: number;
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
    version: 0,
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
// back to a plain in-memory global, matching pre-Redis behavior.
//
// Serverless instances handle requests concurrently, so a plain
// read-modify-write (GET the blob, mutate it, SET it back) is a lost-update
// race: two requests that read the blob around the same time will each
// write back a version missing the other's change — including other
// people's already-committed users/activities, which silently vanish.
// Writes instead go through `mutate()`, which re-reads fresh on every
// attempt and commits via a Lua script that only applies the write if the
// stored `version` still matches what was read (optimistic concurrency
// control) — an EVAL script is one atomic round trip on the Redis server,
// so the check-and-set can't be interleaved by another request. On a
// version mismatch it retries against the newly-current data instead of
// clobbering it.

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

// Atomic compare-and-swap: only writes KEYS[1] if its current `version`
// field still equals ARGV[2]; returns 1 on success, 0 on a stale version,
// -1 if the key doesn't exist yet (caller should re-seed and retry).
const CAS_SCRIPT = `
local raw = redis.call('GET', KEYS[1])
if raw == false then return -1 end
local obj = cjson.decode(raw)
if obj.version ~= tonumber(ARGV[2]) then return 0 end
redis.call('SET', KEYS[1], ARGV[1])
return 1
`;

// Always-fresh read, bypassing the per-request cache below. Used both for
// the very first read of a request and for every retry inside `mutate()`.
async function fetchStore(): Promise<Store> {
  if (redis) {
    const existing = await redis.get<Store>(STORE_KEY);
    if (existing) return existing;

    // Cold start: nothing seeded yet. Use SET-if-not-exists so that if two
    // requests race here, only the first actually writes the pristine seed
    // — the loser re-reads instead of clobbering whatever the winner (or a
    // real mutation that landed in between) already committed.
    const fresh = buildStore();
    const created = await redis.set(STORE_KEY, fresh, { nx: true });
    if (created) return fresh;
    const seeded = await redis.get<Store>(STORE_KEY);
    return seeded ?? fresh;
  }

  if (!global.__moveStore) {
    global.__moveStore = buildStore();
  }
  // Dev-time HMR can keep a stale singleton around after the Store shape
  // changes; backfill any fields that predate the cached instance.
  global.__moveStore.waitlist ??= [];
  global.__moveStore.version ??= 0;
  return global.__moveStore;
}

const getStore = cache(fetchStore);

// Runs `mutator` against a fresh copy of the store and commits the result.
// Against Redis this retries with newly-fetched data whenever another
// request's write lands first, so no committed change is ever lost. The
// in-memory fallback mutates `global.__moveStore` synchronously (no
// `await` between the read and the write), so within a single Node
// process it's already atomic — no retry loop needed there.
async function mutate<T>(mutator: (store: Store) => T): Promise<T> {
  if (!redis) {
    const store = await getStore();
    return mutator(store);
  }

  const MAX_ATTEMPTS = 10;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const store = await fetchStore();
    const result = mutator(store);
    const nextVersion = store.version + 1;
    store.version = nextVersion;

    const outcome = await redis.eval(
      CAS_SCRIPT,
      [STORE_KEY],
      [JSON.stringify(store), String(nextVersion - 1)]
    );

    if (outcome === 1) return result;

    // outcome is 0 (stale version) or -1 (key vanished) — another request
    // won the race; back off briefly and retry against fresh data.
    await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 60));
  }

  throw new Error("Store is under heavy contention — please try again.");
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
  return mutate((store) => {
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
    return user;
  });
}

export async function setUserPremium(
  userId: string,
  isPremium: boolean
): Promise<void> {
  await mutate((store) => {
    const user = store.users.find((u) => u.id === userId);
    if (user) {
      user.isPremium = isPremium;
    }
  });
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
  return mutate((store) => {
    const activity: Activity = {
      ...input,
      id: nextId("a"),
      createdAt: new Date().toISOString(),
    };
    store.activities.push(activity);
    return activity;
  });
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
  return mutate((store) => {
    const request: JoinRequest = {
      id: nextId("jr"),
      activityId,
      userId,
      status,
      requestedAt: new Date().toISOString(),
    };
    store.joinRequests.push(request);
    return request;
  });
}

export async function setJoinRequestStatus(
  id: string,
  status: JoinRequestStatus
): Promise<JoinRequest | undefined> {
  return mutate((store) => {
    const request = store.joinRequests.find((r) => r.id === id);
    if (request) {
      request.status = status;
    }
    return request;
  });
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
  return mutate((store) => {
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

    return rating;
  });
}

// --- Notifications ---

export async function createNotification(
  userId: string,
  type: NotificationType,
  activityId: string
): Promise<Notification> {
  return mutate((store) => {
    const notification: Notification = {
      id: nextId("n"),
      userId,
      type,
      activityId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    store.notifications.push(notification);
    return notification;
  });
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  return (await getStore()).notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationRead(id: string): Promise<void> {
  await mutate((store) => {
    const notification = store.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await mutate((store) => {
    for (const n of store.notifications) {
      if (n.userId === userId && !n.read) {
        n.read = true;
      }
    }
  });
}

// --- Waitlist ---

export async function addToWaitlist(email: string): Promise<{ alreadyJoined: boolean }> {
  return mutate((store) => {
    const normalized = email.trim().toLowerCase();
    const existing = store.waitlist.find((w) => w.email.toLowerCase() === normalized);
    if (existing) return { alreadyJoined: true };

    store.waitlist.push({
      id: nextId("wl"),
      email: email.trim(),
      joinedAt: new Date().toISOString(),
    });
    return { alreadyJoined: false };
  });
}
