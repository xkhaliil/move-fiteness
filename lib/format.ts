export function formatActivityDateTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(date) - startOfDay(now)) / dayMs);

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let day: string;
  if (diffDays === 0) day = "Today";
  else if (diffDays === 1) day = "Tomorrow";
  else if (diffDays === -1) day = "Yesterday";
  else if (diffDays < 0)
    day = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  else if (diffDays < 7) day = date.toLocaleDateString("en-GB", { weekday: "short" });
  else day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return `${day} · ${time}`;
}

export function formatRatingCount(count: number): string {
  return count === 1 ? "1 rating" : `${count} ratings`;
}
