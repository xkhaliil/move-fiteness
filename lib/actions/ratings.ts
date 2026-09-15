"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../session";
import { createRating, getActivityById, hasRated, isActivityPast } from "../store";
import type { RatingTag } from "../types";

const VALID_TAGS: RatingTag[] = ["no-show", "great-vibe", "good-pace", null];

export async function submitRating(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const activityId = String(formData.get("activityId") ?? "");
  const rateeId = String(formData.get("rateeId") ?? "");
  const score = Number(formData.get("score") ?? 0);
  const rawTag = String(formData.get("tag") ?? "");
  const tag = (VALID_TAGS.includes(rawTag as RatingTag) ? rawTag : null) as RatingTag;

  const activity = await getActivityById(activityId);
  if (
    activity &&
    isActivityPast(activity) &&
    rateeId &&
    rateeId !== user!.id &&
    score >= 1 &&
    score <= 5 &&
    !(await hasRated(activityId, user!.id, rateeId))
  ) {
    await createRating({
      activityId,
      raterId: user!.id,
      rateeId,
      score,
      tag,
    });
    revalidatePath(`/profile/${rateeId}`);
    revalidatePath(`/activities/${activityId}/rate`);
  }

  redirect(`/activities/${activityId}/rate`);
}
