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
  const activity = getActivityById(activityId);
  if (!activity) redirect("/feed");
  if (activity.hostId === user!.id) redirect(`/activities/${activityId}`);

  const existing = getJoinRequest(activityId, user!.id);
  const headcount = getApprovedParticipantIds(activityId).length;
  if (!existing && headcount < activity!.capacity) {
    createJoinRequest(activityId, user!.id, "pending");
    createNotification(activity!.hostId, "join_request", activityId);
  }

  revalidatePath(`/activities/${activityId}`);
  redirect(`/activities/${activityId}`);
}

export async function approveRequest(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const requestId = String(formData.get("requestId") ?? "");
  const request = getJoinRequestById(requestId);
  if (!request) redirect("/feed");

  const activity = getActivityById(request!.activityId);
  if (!activity || activity.hostId !== user!.id) {
    redirect(`/activities/${request!.activityId}`);
  }

  setJoinRequestStatus(requestId, "approved");
  createNotification(request!.userId, "request_approved", request!.activityId);

  revalidatePath(`/activities/${request!.activityId}`);
  revalidatePath(`/activities/${request!.activityId}/requests`);
  revalidatePath("/feed");
  redirect(`/activities/${request!.activityId}/requests`);
}

export async function declineRequest(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const requestId = String(formData.get("requestId") ?? "");
  const request = getJoinRequestById(requestId);
  if (!request) redirect("/feed");

  const activity = getActivityById(request!.activityId);
  if (!activity || activity.hostId !== user!.id) {
    redirect(`/activities/${request!.activityId}`);
  }

  setJoinRequestStatus(requestId, "declined");

  revalidatePath(`/activities/${request!.activityId}`);
  revalidatePath(`/activities/${request!.activityId}/requests`);
  redirect(`/activities/${request!.activityId}/requests`);
}
