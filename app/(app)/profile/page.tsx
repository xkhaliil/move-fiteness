import { getCurrentUser } from "@/lib/session";
import { TopBar } from "@/components/ui/TopBar";
import { ProfileContent } from "@/components/profile/ProfileContent";

export default async function OwnProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <TopBar title="Profile" />
      <ProfileContent profileUser={user} isOwn />
    </div>
  );
}
