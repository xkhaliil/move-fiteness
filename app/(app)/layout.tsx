import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getFeedNotifications } from "@/lib/notifications";
import { AppNav } from "@/components/ui/AppNav";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const unreadCount = getFeedNotifications(user!.id).filter((n) => !n.read).length;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col pb-20 lg:max-w-6xl lg:pb-0 lg:pl-60">
      {children}
      <AppNav unreadCount={unreadCount} />
    </div>
  );
}
