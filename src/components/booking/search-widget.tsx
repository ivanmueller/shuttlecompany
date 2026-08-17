"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  stops,
  destinationsFrom,
  findRoutes,
  headwayLabel,
} from "@/data/network";
import { Button } from "@/components/ui/button";
import { cn, todayISO, addDaysISO } from "@/lib/utils";
import { site } from "@/config/site";

/**
 * Journey search.
 *
 * Modelled on Ember's above-the-fold search, which is the single best
 * converting pattern in this category: the visitor's first interaction is
 * progress toward a ticket, not a scroll through marketing.
 *
 * Deliberate choices:
 *  - Sensible defaults on every field, so "Search" is reachable in one tap.
 *  - Destination options are filtered by origin, so an unbookable pair is
 *    impossible to construct.
 *  - No account, no email capture, nothing between here and the timetable.
 */

const DEFAULT_ORIGIN = "ll-gondola";
const DEFAULT_DESTINATION = "moraine-lake";

export function SearchWidget({
  className,
  tone = "raised",
}: {
  className?: string;
  /** `raised` floats over the hero photo; `flat` sits inside a page section. */
  tone?: "raised" | "flat";
}) {
  const router = useRouter();
  const today = todayISO();

  const [originId, setOriginId] = useState(DEFAULT_ORIGIN);
  const [destinationId, setDestinationId] = useState(DEFAULT_DESTINATION);
  const [date, setDate] = useState(today);
  const [travellers, setTravellers] = useState(2);

  const destinationOptions = useMemo(() => {
    const allowed = new Set(destinationsFrom(originId));
    return stops.filter((s) => allowed.has(s.id));
  }, [originId]);

  const matches = useMemo(
    () => findRoutes(originId, destinationId),
    [originId, destinationId],
  );

  const handleOriginChange = (next: string) => {
    setOriginId(next);
    // Keep the pair valid: if the current destination is no longer reachable,
    // fall back to the first one that is rather than showing a dead search.
    const allowed = destinationsFrom(next);
    if (!allowed.includes(destinationId)) {
      setDestinationId(allowed[0] ?? "");
    }
  };

  const swap = () => {
    const nextOrigin = destinationId;
    const nextDestination = originId;
    setOriginId(nextOrigin);
    const allowed = destinationsFrom(nextOrigin);
    setDestinationId(allowed.includes(nextDestination) ? nextDestination : allowed[0] ?? "");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: originId,
      to: destinationId,
      date,
      pax: String(travellers),
    });
    router.push(`/book?${params.toString()}`);
  };

  const fieldClasses =
    "h-12 w-full rounded-[var(--radius)] border border-line-strong bg-paper px-3 text-[0.9375rem] " +
    "font-medium text-ink transition-colors hover:border-brand-400 focus:border-brand-600";

  const labelClasses =
    "mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle";

  return (
    <form
      onSubmit={submit}
      aria-label="Search departures"
      className={cn(
        "rounded-[calc(var(--radius)+0.35rem)] bg-paper p-4 sm:p-5",
        tone === "raised"
          ? "shadow-[0_2px_4px_rgb(22_24_28/0.08),0_24px_56px_-20px_rgb(22_24_28/0.5)] ring-1 ring-black/5"
          : "border border-line",
        className,
      )}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_auto] lg:items-end lg:gap-2.5">
        <div className="min-w-0">
          <label htmlFor="sw-from" className={labelClasses}>
            Travelling from
          </label>
          <select
            id="sw-from"
            value={originId}
            onChange={(e) => handleOriginChange(e.target.value)}
            className={fieldClasses}
          >
            {stops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="hidden size-12 shrink-0 place-items-center rounded-[var(--radius)] border border-line-strong text-ink-muted transition-colors hover:border-brand-400 hover:text-brand-700 lg:grid"
        >
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v14M6 3L3 6M6 3l3 3M14 17V3M14 17l-3-3M14 17l3-3" />
          </svg>
        </button>

        <div className="min-w-0">
          <label htmlFor="sw-to" className={labelClasses}>
            Going to
          </label>
          <select
            id="sw-to"
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className={fieldClasses}
          >
            {destinationOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="sw-date" className={labelClasses}>
            Date
          </label>
          <input
            id="sw-date"
            type="date"
            value={date}
            min={today}
            max={addDaysISO(today, 365)}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClasses}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="sw-pax" className={labelClasses}>
            Travellers
          </label>
          <select
            id="sw-pax"
            value={travellers}
            onChange={(e) => setTravellers(Number(e.target.value))}
            className={fieldClasses}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "traveller" : "travellers"}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" size="lg" className="h-12 w-full lg:w-auto lg:px-8">
          Find departures
        </Button>
      </div>

      {/* Reassurance directly under the button, where hesitation actually
          happens. Each line is a specific, checkable claim. */}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
        {matches.length > 0 ? (
          <span className="flex items-center gap-1.5 font-semibold text-ontime-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-ontime" />
            {matches.length === 1
              ? `Route ${matches[0].route.number} · ${headwayLabel(matches[0].route).toLowerCase()}`
              : `${matches.length} routes serve this trip`}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-semibold text-delay-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-delay" />
            No direct service — search to see connections
          </span>
        )}
        <span>Free changes up to 2 hours before departure</span>
        <span className="hidden sm:inline">No booking fee</span>
        <span className="hidden md:inline">Season {site.season.label}</span>
      </div>
    </form>
  );
}
