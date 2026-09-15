"use client";

import { useState } from "react";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-8 w-8 transition ${filled ? "text-accent" : "text-surface-raised"}`}
      fill="currentColor"
    >
      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77L1.62 7.59l5.79-.84L10 1.5z" />
    </svg>
  );
}

export function StarRatingInput({ name = "score" }: { name?: string }) {
  const [value, setValue] = useState(5);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-1" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setValue(n)}
            onMouseEnter={() => setHover(n)}
            className="cursor-pointer"
          >
            <StarIcon filled={n <= shown} />
          </button>
        ))}
      </div>
    </div>
  );
}
