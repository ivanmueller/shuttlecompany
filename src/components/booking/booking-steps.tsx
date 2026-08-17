import { cn } from "@/lib/utils";

/**
 * Funnel progress.
 *
 * Three steps, stated up front. Knowing the checkout is two screens deep and
 * not seven measurably reduces abandonment at the first form field, which is
 * where an unfamiliar operator loses the most bookings.
 */
const steps = ["Choose a departure", "Traveller details", "Confirmed"];

export function BookingSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "grid size-6 place-items-center rounded-full text-xs font-bold",
                  done && "bg-ontime text-white",
                  active && "bg-brand-800 text-white",
                  !done && !active && "border border-line-strong text-ink-subtle",
                )}
              >
                {done ? (
                  <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                ) : (
                  n
                )}
              </span>
              <span
                className={cn(
                  "font-medium",
                  active ? "text-ink" : "text-ink-subtle",
                )}
                aria-current={active ? "step" : undefined}
              >
                {label}
              </span>
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden className="hidden h-px w-6 bg-line-strong sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
