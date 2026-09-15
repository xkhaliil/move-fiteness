"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../session";
import { createActivity, createJoinRequest, getUsers } from "../store";
import type { ActivityLevel, ActivityType } from "../types";

const VALID_TYPES: ActivityType[] = [
  "running",
  "walking",
  "cycling",
  "basketball",
  "football",
  "padel",
  "badminton",
  "gym",
  "yoga",
  "swimming",
];

async function pickInterestedSeeders(type: ActivityType, hostId: string, count: number): Promise<string[]> {
  const users = await getUsers();
  const candidates = users.filter(
    (u) => u.id !== hostId && u.interests.includes(type)
  );
  const pool = candidates.length > 0 ? candidates : users.filter((u) => u.id !== hostId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((u) => u.id);
}

export async function createActivityAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const type = String(formData.get("type") ?? "") as ActivityType;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim();
  const locationName = String(formData.get("locationName") ?? "").trim();
  const dateTimeInput = String(formData.get("dateTime") ?? "");
  const capacity = Math.max(2, Number(formData.get("capacity") ?? 4));
  const level = String(formData.get("level") ?? "any") as ActivityLevel;

  if (!VALID_TYPES.includes(type) || !title || !neighborhood || !locationName || !dateTimeInput) {
    redirect("/activities/new?error=missing");
  }

  const dateTime = new Date(dateTimeInput).toISOString();

  const activity = await createActivity({
    hostId: user.id,
    type,
    title,
    description,
    neighborhood,
    locationName,
    dateTime,
    capacity,
    level,
  });

  const interestedCount = Math.random() < 0.5 ? 1 : 2;
  const seededInterested = await pickInterestedSeeders(type, user.id, interestedCount);
  for (const seedUserId of seededInterested) {
    await createJoinRequest(activity.id, seedUserId, "pending");
  }

  revalidatePath("/feed");
  redirect(`/activities/${activity.id}`);
}
