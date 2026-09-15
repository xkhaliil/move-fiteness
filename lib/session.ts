import { cookies } from "next/headers";
import { getUserById } from "./store";
import type { User } from "./types";

export const SESSION_COOKIE = "move_uid";

export async function getCurrentUser(): Promise<User | undefined> {
  const store = await cookies();
  const userId = store.get(SESSION_COOKIE)?.value;
  if (!userId) return undefined;
  return getUserById(userId);
}
