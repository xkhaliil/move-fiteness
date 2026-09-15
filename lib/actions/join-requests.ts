"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../session";
import {
  createJoinRequest,
  createNotification,
  getActivityById,
  getApprovedParticipantIds,
  getJoinRequest,
  getJoinRequestById,
  setJoinRequestStatus,
} from "../store";

export async function requestToJoin(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const activityId = String(formData.get("activityId") ?? "");
  const activity = await getActivityById(activityId);
  if (!activity) redirect("/feed");
  if (activity.hostId === user!.id) redirect(`/activities/${activityId}`);

  const existing = await getJoinRequest(activityId, user!.id);
  const headcount = (await getApprovedParticipantIds(activityId)).length;
  if (!existing && headcount < activity!.capacity) {
    await createJoinRequest(activityId, user!.id, "pending");
    await createNotification(activity!.hostId, "join_request", activityId);
  }

  revalidatePath(`/activities/${activityId}`);
  redirect(`/activities/${activityId}`);
}

export async function approveRequest(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const requestId = String(formData.get("requestId") ?? "");
  const request = await getJoinRequestById(requestId);
  if (!request) redirect("/feed");

  const activity = await getActivityById(request!.activityId);
  if (!activity || activity.hostId !== user!.id) {
    redirect(`/activities/${request!.activityId}`);
  }

  await setJoinRequestStatus(requestId, "approved");
  await createNotification(request!.userId, "request_approved", request!.activityId);

  revalidatePath(`/activities/${request!.activityId}`);
  revalidatePath(`/activities/${request!.activityId}/requests`);
  revalidatePath("/feed");
  redirect(`/activities/${request!.activityId}/requests`);
}

export async function declineRequest(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const requestId = String(formData.get("requestId") ?? "");
  const request = await getJoinRequestById(requestId);
  if (!request) redirect("/feed");

  const activity = await getActivityById(request!.activityId);
  if (!activity || activity.hostId !== user!.id) {
    redirect(`/activities/${request!.activityId}`);
  }

  await setJoinRequestStatus(requestId, "declined");

  revalidatePath(`/activities/${request!.activityId}`);
  revalidatePath(`/activities/${request!.activityId}/requests`);
  redirect(`/activities/${request!.activityId}/requests`);
}
