import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import {
  getActivityById,
  getJoinRequestsForActivity,
  getUserById,
  ratingAverage,
} from "@/lib/store";
import { approveRequest, declineRequest } from "@/lib/actions/join-requests";
import { Avatar } from "@/components/ui/Avatar";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { Button } from "@/components/ui/Button";
import { TopBar } from "@/components/ui/TopBar";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function ManageRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivityById(id);
  if (!activity) notFound();

  const user = await getCurrentUser();
  if (!user) return null;
  if (activity!.hostId !== user.id) {
    redirect(`/activities/${id}`);
  }

  const requests = await getJoinRequestsForActivity(activity!.id);
  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");

  return (
    <div>
      <TopBar title="Requests" backHref={`/activities/${id}`} />

      <div className="flex flex-col gap-6 px-4 py-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 lg:px-8 lg:py-8">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Pending ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <EmptyState
              title="No pending requests"
              description="You'll see people here as soon as they ask to join."
            />
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {await Promise.all(pending.map(async (req) => {
                const requester = await getUserById(req.userId);
                if (!requester) return null;
                return (
                  <div
                    key={req.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
                  >
                    <Link
                      href={`/profile/${requester.id}`}
                      className="flex flex-1 items-center gap-3"
                    >
                      <Avatar name={requester.name} size="md" />
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {requester.name}
                        </p>
                        <RatingBadge
                          average={ratingAverage(requester)}
                          count={requester.ratingCount}
                          size="sm"
                        />
                      </div>
                    </Link>
                    <div className="flex gap-2">
                      <form action={declineRequest}>
                        <input type="hidden" name="requestId" value={req.id} />
                        <Button type="submit" variant="secondary" size="sm">
                          Decline
                        </Button>
                      </form>
                      <form action={approveRequest}>
                        <input type="hidden" name="requestId" value={req.id} />
                        <Button type="submit" size="sm">
                          Approve
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              }))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Confirmed ({approved.length}/{activity!.capacity})
          </h2>
          {approved.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">No one confirmed yet.</p>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {await Promise.all(approved.map(async (req) => {
                const participant = await getUserById(req.userId);
                if (!participant) return null;
                return (
                  <Link
                    key={req.id}
                    href={`/profile/${participant.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
                  >
                    <Avatar name={participant.name} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {participant.name}
                      </p>
                      <RatingBadge
                        average={ratingAverage(participant)}
                        count={participant.ratingCount}
                        size="sm"
                      />
                    </div>
                  </Link>
                );
              }))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
