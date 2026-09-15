import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getUserById } from "@/lib/store";
import { TopBar } from "@/components/ui/TopBar";
import { ProfileContent } from "@/components/profile/ProfileContent";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileUser = await getUserById(id);
  if (!profileUser) notFound();

  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.id === id) {
    redirect("/profile");
  }

  return (
    <div>
      <TopBar title={profileUser!.name} backHref="/feed" />
      <ProfileContent profileUser={profileUser!} isOwn={false} />
    </div>
  );
}
