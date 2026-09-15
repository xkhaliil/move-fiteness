import { createActivityAction } from "@/lib/actions/activities";
import { ACTIVITY_TYPE_LABEL, type ActivityType } from "@/lib/types";
import { ActivityIcon } from "@/components/ui/ActivityIcon";
import { Button } from "@/components/ui/Button";
import { TopBar } from "@/components/ui/TopBar";

const TYPES = Object.keys(ACTIVITY_TYPE_LABEL) as ActivityType[];

const inputClass =
  "h-12 rounded-xl border border-border bg-surface px-4 text-sm text-text placeholder:text-text-muted focus:border-accent-secondary focus:outline-none";

export default function NewActivityPage() {
  return (
    <div>
      <TopBar title="Post an activity" backHref="/feed" />

      <form
        action={createActivityAction}
        className="flex flex-col gap-5 px-4 py-5 lg:mx-auto lg:max-w-2xl lg:px-8 lg:py-8"
      >
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-text-muted">Activity type</span>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  defaultChecked={type === "running"}
                  className="sr-only"
                  required
                />
                <ActivityIcon type={type} className="h-4 w-4" />
                {ACTIVITY_TYPE_LABEL[type]}
              </label>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Title</span>
          <input
            name="title"
            required
            placeholder="Easy 5k along the beach"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">
            Description <span className="text-text-muted/70">(optional)</span>
          </span>
          <textarea
            name="description"
            rows={3}
            placeholder="Pace, what to bring, anything people should know."
            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent-secondary focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">Neighborhood</span>
            <input
              name="neighborhood"
              required
              placeholder="Gràcia"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">Capacity</span>
            <input
              name="capacity"
              type="number"
              min={2}
              max={30}
              defaultValue={6}
              required
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Meeting point</span>
          <input
            name="locationName"
            required
            placeholder="Plaça de la Vila de Gràcia"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Date & time</span>
          <input
            name="dateTime"
            type="datetime-local"
            required
            className={inputClass}
          />
        </label>

        <Button type="submit" size="lg" className="mt-2 w-full">
          Post activity
        </Button>
      </form>
    </div>
  );
}
