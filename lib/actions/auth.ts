"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "../session";
import { createJoinRequest, createUser } from "../store";
import { PAST_ONBOARDING_ACTIVITY_ID } from "../seed-data";
import type { ActivityType } from "../types";

export async function completeOnboarding(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "Barcelona").trim() || "Barcelona";
  const interests = formData.getAll("interests").map((v) => String(v)) as ActivityType[];

  if (!name) {
    redirect("/onboarding?error=name");
  }

  const user = createUser({
    name,
    city,
    interests: interests.slice(0, 3),
  });

  createJoinRequest(PAST_ONBOARDING_ACTIVITY_ID, user.id, "approved");

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/feed");
}
