"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../session";
import { setUserPremium } from "../store";

export async function upgradeToPremium(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  setUserPremium(user!.id, true);
  revalidatePath("/feed");
  revalidatePath("/settings");
  redirect("/feed?upgraded=1");
}

export async function downgradeFromPremium(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  setUserPremium(user!.id, false);
  revalidatePath("/feed");
  revalidatePath("/settings");
  redirect("/settings");
}
