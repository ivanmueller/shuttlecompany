"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  stops,
  stopById,
  planJourneys,
  reachableStopIds,
  headwayLabel,
} from "@/data/network";
import { Button } from "@/components/ui/button";
import { cn, todayISO, addDaysISO, formatDateShort, formatCad } from "@/lib/utils";
import { bookableRange, firstBookableDate } from "@/lib/season";
import { track } from "@/lib/analytics";
import { site } from "@/config/site";

/**
 * Journey search.
 *
 * This is a *refinement*, not a gate. The hero leads with a live board of
 * real departures; someone whose trip is the default never has to touch this
 * form. It exists for the minority who want a different route, day or party
 * size.
 *
 * Three things here were previously wrong in ways that stopped purchases:
 *
 *  1. The destination list was filtered to stops sharing a single route with
 *     the origin, so from Banff or Canmore "Moraine Lake" was not offered at
 *     all — and on switching origin the code silently reassigned the
 *     destination to `allowed[0]`, which for Banff is Castle Junction, a
 *     highway pull-out. It now lists everything reachable in up to two legs
 *     and quotes the connection.
 *  2. The party count was posted as `pax` and read at /book as *adults*, so a
 *     family with two under-sixes was quoted double. It now posts a real
 *     passenger mix.
 *  3. The date accepted anything up to a year out, including months when no
 *     bus runs. It is now clamped to the season, and the common case — today
 *     or tomorrow — is a chip rather than a date wheel.
 */

const DEFAULT_ORIGIN = "ll-village"; // Route 2 (sunrise) departs here; the
// gondola lot does not, so defaulting there hid the highest-fare product.
const DEFAULT_DESTINATION = "moraine-lake";

const PAX = [
  { key: "adults", label: "Adults", sub: "18–64" },
  { key: "seniors", label: "Seniors", sub: "65+" },
  { key: "youth", label: "Youth", sub: "6–17" },
  { key: "children", label: "Children", sub: "Under 6 — free" },
] as const;

type PaxKey = (typeof PAX)[number]["key"];

export function SearchWidget({
  className,
  tone = "raised",
  origin,
  destination,
}: {
  className?: string;
  /** `raised` floats over the hero; `flat` sits inside a page section. */
  tone?: "raised" | "flat";
  /** Lets the hero's origin router drive the form without duplicating state. */
  origin?: string;
  destination?: string;
}) {
  const router = useRouter();
  const today = todayISO();
  const range = bookableRange(today);
  const [pending, startTransition] = useTransition();

  const [originId, setOriginId] = useState(origin ?? DEFAULT_ORIGIN);
  const [destinationId, setDestinationId] = useState(destination ?? DEFAULT_DESTINATION);
  const [date, setDate] = useState(firstBookableDate(today));
  const [pax, setPax] = useState<Record<PaxKey, number>>({
    adults: 2,
    seniors: 0,
    youth: 0,
    children: 0,
  });
  const [paxOpen, setPaxOpen] = useState(false);

  const destinationOptions = useMemo(() => {
    const allowed = new Set(reachableStopIds(originId));
    return stops.filter((s) => allowed.has(s.id));
  }, [originId]);

  const journeys = useMemo(
    () => planJourneys(originId, destinationId),
    [originId, destinationId],
  );
  const best = journeys[0];

  const totalPax = PAX.reduce((n, t) => n + pax[t.key], 0);
  const paxLabel =
    totalPax === 1
      ? "1 traveller"
      : pax.children > 0
        ? `${totalPax} travellers · ${pax.children} free`
        : `${totalPax} travellers`;

  const handleOriginChange = (next: string) => {
    setOriginId(next);
    track({ name: "origin_switched", to: next });
    /* Only fall back when the pair is genuinely unservable. With connections
       in the planner that is now almost never — and we never silently pick a
       highway pull-out on the visitor's behalf. */
    if (planJourneys(next, destinationId).length === 0) {
      const allowed = reachableStopIds(next);
      setDestinationId(allowed.includes(DEFAULT_DESTINATION) ? DEFAULT_DESTINATION : (allowed[0] ?? ""));
    }
  };

  const swap = () => {
    const nextOrigin = destinationId;
    const nextDestination = originId;
    setOriginId(nextOrigin);
    setDestinationId(
      planJourneys(nextOrigin, nextDestination).length > 0
        ? nextDestination
        : (reachableStopIds(nextOrigin)[0] ?? ""),
    );
  };

  const setCount = (key: PaxKey, delta: number) =>
    setPax((p) => {
      const next = { ...p, [key]: Math.max(0, p[key] + delta) };
      if (next.adults < 1) next.adults = 1;
      return next;
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: originId,
      to: destinationId,
      date,
      adult: String(pax.adults),
      senior: String(pax.seniors),
      youth: String(pax.youth),
      child: String(pax.children),
    });
    track({
      name: "search_submitted",
      from: originId,
      to: destinationId,
      daysAhead: Math.max(
        0,
        Math.round(
          (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000,
        ),
      ),
      pax: totalPax,
      connecting: (best?.legs.length ?? 1) > 1,
    });
    startTransition(() => router.push(`/book?${params.toString()}`));
  };

  const fieldClasses =
    "h-12 w-full rounded-[var(--radius)] border border-line-strong bg-paper px-3 text-base " +
    "font-medium text-ink transition-colors hover:border-brand-400 focus:border-brand-600";

  const labelClasses =
    "mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle";

  /* Native-submit fallback. Before hydration the form had no `action` and no
     named fields, so an early tap reloaded the page and discarded every
     selection. It now degrades into a working GET. */
  const dayChips = Array.from({ length: 3 }, (_, i) => addDaysISO(today, i)).filter(
    (d) => d >= range.min && d <= range.max,
  );

  return (
    <form
      onSubmit={submit}
      action="/book"
      method="get"
      aria-label="Search departures"
      className={cn(
        "rounded-[calc(var(--radius)+0.35rem)] bg-paper p-4 sm:p-5",
        tone === "raised"
          ? "shadow-[0_2px_4px_rgb(22_24_28/0.08),0_24px_56px_-20px_rgb(22_24_28/0.5)] ring-1 ring-black/5"
          : "border border-line",
        className,
      )}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_auto] lg:items-end lg:gap-2.5">
        <div className="min-w-0">
          <label htmlFor="sw-from" className={labelClasses}>
            Travelling from
          </label>
          <select
            id="sw-from"
            name="from"
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

        {/* Reversing a journey is a phone gesture, not a desktop one. This
            used to be `lg:grid` — hidden on the only device where retyping
            both fields is genuinely annoying. */}
        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="grid size-12 shrink-0 place-items-center justify-self-end rounded-[var(--radius)] border border-line-strong text-ink-muted transition-colors hover:border-brand-400 hover:text-brand-700 lg:justify-self-auto"
        >
          <svg viewBox="0 0 20 20" className="size-4 rotate-90 lg:rotate-0" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v14M6 3L3 6M6 3l3 3M14 17V3M14 17l-3-3M14 17l3-3" />
          </svg>
        </button>

        <div className="min-w-0">
          <label htmlFor="sw-to" className={labelClasses}>
            Going to
          </label>
          <select
            id="sw-to"
            name="to"
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
            name="date"
            type="date"
            value={date}
            min={range.min}
            max={range.max}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClasses}
          />
        </div>

        {/* Party size as a real mix. A single count was posted as `pax` and
            read at /book as adults, quoting a family of four $116 for a $58
            trip — the worst possible direction for a price to move. */}
        <div className="relative min-w-0">
          <span className={labelClasses}>Travellers</span>
          <button
            type="button"
            onClick={() => setPaxOpen((v) => !v)}
            aria-expanded={paxOpen}
            aria-controls="sw-pax-panel"
            className={cn(fieldClasses, "flex items-center justify-between text-left")}
          >
            <span className="truncate">{paxLabel}</span>
            <svg viewBox="0 0 20 20" className="ml-2 size-3.5 shrink-0 text-ink-subtle" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 7.5l5 5 5-5" />
            </svg>
          </button>

          {paxOpen && (
            <div
              id="sw-pax-panel"
              className="absolute left-0 right-0 top-full z-30 mt-2 rounded-[var(--radius)] border border-line-strong bg-paper p-3 shadow-[var(--shadow-lift)] lg:w-64"
            >
              {PAX.map((t) => (
                <div key={t.key} className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-sm">
                    <span className="font-semibold text-ink">{t.label}</span>{" "}
                    <span className="text-ink-subtle">{t.sub}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCount(t.key, -1)}
                      disabled={pax[t.key] === 0 || (t.key === "adults" && pax.adults <= 1)}
                      aria-label={`One fewer ${t.label.toLowerCase()}`}
                      className="grid size-11 place-items-center rounded-md border border-line-strong text-ink-muted disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular">
                      {pax[t.key]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCount(t.key, 1)}
                      aria-label={`One more ${t.label.toLowerCase()}`}
                      className="grid size-11 place-items-center rounded-md border border-line-strong text-ink-muted"
                    >
                      +
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
          {PAX.map((t) => (
            <input key={t.key} type="hidden" name={t.key === "adults" ? "adult" : t.key === "seniors" ? "senior" : t.key === "youth" ? "youth" : "child"} value={pax[t.key]} readOnly />
          ))}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-12 w-full lg:w-auto lg:px-8"
        >
          {/* A CTA with no pending state looks dead on a slow connection,
              which produces the double-tap and then the back-button. */}
          {pending ? "Finding seats…" : "See times & prices"}
        </Button>
      </div>

      {/* Same-day and next-day are almost all of this demand, so they are one
          tap rather than a date wheel. */}
      {dayChips.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {dayChips.map((d, i) => (
            <button
              key={d}
              type="button"
              onClick={() => setDate(d)}
              aria-pressed={date === d}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                date === d
                  ? "border-brand-700 bg-brand-800 text-white"
                  : "border-line-strong text-ink-muted hover:border-brand-400",
              )}
            >
              {i === 0 ? "Today" : i === 1 ? "Tomorrow" : formatDateShort(d)}
            </button>
          ))}
        </div>
      )}

      {/* Reassurance directly under the button, where hesitation actually
          happens. Each line is a specific, checkable claim — and none of them
          is hidden on the device most of these visitors are holding. */}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
        {best ? (
          <span className="flex items-center gap-1.5 font-semibold text-ontime-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-ontime" />
            {best.legs.length === 1
              ? `Route ${best.legs[0].route.number} · ${headwayLabel(best.legs[0].route).toLowerCase()} · ${formatCad(best.adultFare)}`
              : `Route ${best.legs[0].route.number} then ${best.legs[1].route.number} via ${stopById(best.viaStopId ?? "").shortName} · ${formatCad(best.adultFare)}`}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-semibold text-delay-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-delay" />
            We don&apos;t serve this pair — try Lake Louise Village
          </span>
        )}
        <span>Free changes up to 2 hours before departure</span>
        <span>No booking fee</span>
        <span className="hidden md:inline">Season {site.season.label}</span>
      </div>
    </form>
  );
}
