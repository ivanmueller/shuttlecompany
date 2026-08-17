"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  routes,
  stops,
  stopById,
  findRoutes,
  getDepartures,
  destinationsFrom,
  headwayLabel,
  segmentMinutes,
  type Route,
  type Departure,
} from "@/data/network";
import { Button, ButtonLink } from "@/components/ui/button";
import { SeatsPill, StatusPill } from "@/components/ui/status-pill";
import { cn, todayISO, addDaysISO, formatCad, formatDateShort } from "@/lib/utils";
import { site } from "@/config/site";

/**
 * Departure selection.
 *
 * Design rules, all of them chosen against measured drop-off in this category:
 *  - The rider lands on a list of real, bookable times. No empty state, no
 *    "please select a route to continue".
 *  - Every control re-filters in place. A page reload between "change date"
 *    and "see times" is where mobile bookings die.
 *  - The running total is visible at all times, including the park pass
 *    caveat. A surprise at the payment step costs more than an honest number
 *    three screens earlier.
 *  - Sold-out departures stay visible and greyed rather than disappearing.
 *    Seeing that 9:00 and 9:20 are gone is what makes 9:40 feel urgent, and
 *    a list that silently shrinks reads as broken.
 */

interface Selection {
  route: Route;
  departure: Departure;
}

const PAX_TYPES = [
  { key: "adult", label: "Adults", sub: "18–64" },
  { key: "senior", label: "Seniors", sub: "65+" },
  { key: "youth", label: "Youth", sub: "6–17" },
  { key: "child", label: "Children", sub: "Under 6 — free" },
] as const;

type PaxKey = (typeof PAX_TYPES)[number]["key"];

export function BookingClient() {
  const router = useRouter();
  const params = useSearchParams();
  const today = todayISO();

  const routeParam = params.get("route");
  const presetRoute = routeParam ? routes.find((r) => r.slug === routeParam) : undefined;

  const [originId, setOriginId] = useState(
    params.get("from") ?? presetRoute?.originId ?? "ll-gondola",
  );
  const [destinationId, setDestinationId] = useState(
    params.get("to") ?? presetRoute?.destinationId ?? "moraine-lake",
  );
  const [date, setDate] = useState(params.get("date") ?? today);
  const [pax, setPax] = useState<Record<PaxKey, number>>({
    adult: Math.max(1, Number(params.get("pax") ?? 2)),
    senior: 0,
    youth: 0,
    child: 0,
  });
  const [selection, setSelection] = useState<Selection | null>(null);

  const destinationOptions = useMemo(() => {
    const allowed = new Set(destinationsFrom(originId));
    return stops.filter((s) => allowed.has(s.id));
  }, [originId]);

  const matches = useMemo(
    () => findRoutes(originId, destinationId),
    [originId, destinationId],
  );

  /* Every departure across every route serving this pair, in time order. */
  const results = useMemo(
    () =>
      matches
        .flatMap((match) =>
          getDepartures(match.route, date).map((departure) => ({
            match,
            route: match.route,
            departure,
          })),
        )
        .sort((a, b) => a.departure.minutes - b.departure.minutes),
    [matches, date],
  );

  /**
   * Grouped by time of day.
   *
   * A flat list of forty-one rows reads as a wall and pushes the afternoon
   * departures — the ones that are actually still available — below three
   * screens of sold-out mornings. Riders also think in "morning / afternoon",
   * not in 24-hour time, so the grouping matches how the decision gets made.
   */
  const groups = useMemo(() => {
    const buckets: {
      id: string;
      label: string;
      note: string;
      items: typeof results;
    }[] = [
      { id: "predawn", label: "Before dawn", note: "Sunrise services", items: [] },
      { id: "morning", label: "Morning", note: "6:00 am – 11:59 am", items: [] },
      { id: "afternoon", label: "Afternoon", note: "12:00 pm – 4:59 pm", items: [] },
      { id: "evening", label: "Evening", note: "5:00 pm onwards", items: [] },
    ];
    for (const result of results) {
      const hour = result.departure.minutes / 60;
      const index = hour < 6 ? 0 : hour < 12 ? 1 : hour < 17 ? 2 : 3;
      buckets[index].items.push(result);
    }
    return buckets.filter((b) => b.items.length > 0);
  }, [results]);

  const totalPax = PAX_TYPES.reduce((n, t) => n + pax[t.key], 0);
  const payingPax = totalPax - pax.child;

  const subtotal = selection
    ? PAX_TYPES.reduce((sum, t) => sum + pax[t.key] * selection.route.fares[t.key], 0)
    : 0;

  const handleOriginChange = (next: string) => {
    setOriginId(next);
    setSelection(null);
    const allowed = destinationsFrom(next);
    if (!allowed.includes(destinationId)) setDestinationId(allowed[0] ?? "");
  };

  const proceed = () => {
    if (!selection) return;
    const qs = new URLSearchParams({
      route: selection.route.slug,
      date,
      time: selection.departure.time,
      from: originId,
      to: destinationId,
      adult: String(pax.adult),
      senior: String(pax.senior),
      youth: String(pax.youth),
      child: String(pax.child),
    });
    router.push(`/book/checkout?${qs.toString()}`);
  };

  const fieldClasses =
    "h-11 w-full rounded-[var(--radius)] border border-line-strong bg-paper px-3 text-[0.9375rem] font-medium text-ink hover:border-brand-400 focus:border-brand-600";
  const labelClasses =
    "mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle";

  return (
    <div className="container-page py-8 md:py-12">
      {/* Search controls */}
      <div className="rounded-[calc(var(--radius)+0.2rem)] border border-line bg-sunken p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label htmlFor="bk-from" className={labelClasses}>
              From
            </label>
            <select
              id="bk-from"
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
          <div>
            <label htmlFor="bk-to" className={labelClasses}>
              To
            </label>
            <select
              id="bk-to"
              value={destinationId}
              onChange={(e) => {
                setDestinationId(e.target.value);
                setSelection(null);
              }}
              className={fieldClasses}
            >
              {destinationOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bk-date" className={labelClasses}>
              Travel date
            </label>
            <input
              id="bk-date"
              type="date"
              value={date}
              min={today}
              max={addDaysISO(today, 365)}
              onChange={(e) => {
                setDate(e.target.value);
                setSelection(null);
              }}
              className={fieldClasses}
            />
          </div>
        </div>

        {/* Quick date shuttle — booking a day either side is one tap. */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {Array.from({ length: 7 }, (_, i) => addDaysISO(today, i)).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDate(d);
                setSelection(null);
              }}
              aria-pressed={date === d}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                date === d
                  ? "border-brand-700 bg-brand-800 text-white"
                  : "border-line-strong bg-paper text-ink-muted hover:border-brand-400 hover:text-ink",
              )}
            >
              {d === today ? "Today" : formatDateShort(d)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        {/* Results */}
        <div>
          {matches.length === 0 ? (
            <div className="rounded-[var(--radius)] border border-delay/25 bg-delay-bg p-6">
              <h2 className="font-display text-lg font-bold text-delay-ink">
                No direct service between those stops
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-delay-ink">
                Most trips connect through Lake Louise Village. Try booking to the
                village first, then a second leg onwards — both tickets are open-return
                and there is no transfer fee.
              </p>
              <ButtonLink
                href="/routes"
                variant="outline"
                size="md"
                className="mt-4"
              >
                See the route map
              </ButtonLink>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-ink">
                  {results.length} departures on {formatDateShort(date)}
                </h2>
                <p className="text-sm text-ink-muted">
                  {matches.length === 1
                    ? headwayLabel(matches[0].route)
                    : `${matches.length} routes serve this trip`}
                </p>
              </div>

              {groups.map((group) => (
                <section key={group.id} className="mt-8 first:mt-5">
                  <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                    <h3 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-ink">
                      {group.label}
                    </h3>
                    <p className="text-xs text-ink-subtle">
                      {group.note} ·{" "}
                      {group.items.filter((i) => i.departure.seatsRemaining > 0).length} of{" "}
                      {group.items.length} available
                    </p>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {group.items.map(({ match, route, departure }) => {
                  const soldOut = departure.seatsRemaining === 0;
                  const notEnough =
                    !soldOut && departure.seatsRemaining < payingPax && payingPax > 0;
                  const active =
                    selection?.route.id === route.id &&
                    selection.departure.time === departure.time;
                  const legMinutes = segmentMinutes(match);

                  return (
                    <li key={`${route.id}-${departure.time}`}>
                      <button
                        type="button"
                        disabled={soldOut || notEnough}
                        onClick={() => setSelection({ route, departure })}
                        aria-pressed={active}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-[var(--radius)] border p-4 text-left transition-all",
                          soldOut || notEnough
                            ? "cursor-not-allowed border-line bg-sunken/70 opacity-60"
                            : active
                              ? "border-brand-700 bg-brand-50 ring-1 ring-brand-700"
                              : "border-line bg-paper hover:border-brand-400 hover:shadow-[var(--shadow-card)]",
                        )}
                      >
                        <span className="w-[5.5rem] shrink-0">
                          <span className="block whitespace-nowrap font-display text-xl font-bold leading-none text-ink tabular">
                            {departure.label}
                          </span>
                          <span className="mt-1 block text-xs text-ink-subtle tabular">
                            {legMinutes} min
                          </span>
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden
                              className="grid size-6 shrink-0 place-items-center rounded bg-brand-800 text-[0.6875rem] font-bold text-white tabular"
                            >
                              {route.number}
                            </span>
                            <span className="truncate text-[0.9375rem] font-semibold text-ink">
                              {route.name}
                            </span>
                          </span>
                          <span className="mt-1.5 flex flex-wrap items-center gap-2">
                            <SeatsPill
                              seats={departure.seatsRemaining}
                              capacity={route.capacity}
                            />
                            {notEnough && (
                              <StatusPill
                                status="delay"
                                size="sm"
                                label={`Not enough for ${payingPax}`}
                              />
                            )}
                            {route.tripType === "round-trip" && (
                              <span className="text-xs text-ink-subtle">
                                Open return included
                              </span>
                            )}
                          </span>
                        </span>

                        <span className="shrink-0 text-right">
                          <span className="block font-display text-lg font-bold text-ink tabular">
                            {formatCad(route.fares.adult)}
                          </span>
                          <span className="block text-xs text-ink-subtle">per adult</span>
                        </span>
                      </button>
                    </li>
                  );
                    })}
                  </ul>
                </section>
              ))}
            </>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[calc(var(--radius)+0.2rem)] border border-line bg-paper p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg font-bold text-ink">Your trip</h2>

            <dl className="mt-4 space-y-2 border-b border-line pb-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Route</dt>
                <dd className="text-right font-medium text-ink">
                  {stopById(originId).shortName} → {stopById(destinationId).shortName}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Date</dt>
                <dd className="font-medium text-ink">{formatDateShort(date)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Departure</dt>
                <dd className="font-medium text-ink tabular">
                  {selection ? selection.departure.label : "Not selected"}
                </dd>
              </div>
            </dl>

            <fieldset className="border-b border-line py-4">
              <legend className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
                Travellers
              </legend>
              <div className="space-y-2.5">
                {PAX_TYPES.map((t) => (
                  <div key={t.key} className="flex items-center justify-between gap-3">
                    <span className="text-sm">
                      <span className="block font-medium text-ink">{t.label}</span>
                      <span className="block text-xs text-ink-subtle">{t.sub}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Remove one ${t.label.toLowerCase().replace(/s$/, "")}`}
                        onClick={() =>
                          setPax((p) => ({ ...p, [t.key]: Math.max(0, p[t.key] - 1) }))
                        }
                        disabled={pax[t.key] === 0 || (t.key === "adult" && pax.adult <= 1)}
                        className="grid size-8 place-items-center rounded-md border border-line-strong text-ink-muted transition-colors hover:border-brand-400 hover:text-ink disabled:opacity-35"
                      >
                        <svg viewBox="0 0 12 12" className="size-3" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M2 6h8" />
                        </svg>
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-ink tabular">
                        {pax[t.key]}
                      </span>
                      <button
                        type="button"
                        aria-label={`Add one ${t.label.toLowerCase().replace(/s$/, "")}`}
                        onClick={() =>
                          setPax((p) => ({ ...p, [t.key]: Math.min(12, p[t.key] + 1) }))
                        }
                        className="grid size-8 place-items-center rounded-md border border-line-strong text-ink-muted transition-colors hover:border-brand-400 hover:text-ink"
                      >
                        <svg viewBox="0 0 12 12" className="size-3" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M6 2v8M2 6h8" />
                        </svg>
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-ink">Total</span>
                <span className="font-display text-2xl font-bold text-ink tabular">
                  {selection ? formatCad(subtotal) : "—"}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-subtle">
                {totalPax} traveller{totalPax === 1 ? "" : "s"} · no booking fee · taxes
                included
              </p>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={proceed}
              disabled={!selection}
              className="w-full"
            >
              {selection ? "Continue to payment" : "Select a departure"}
            </Button>

            <ul className="mt-4 space-y-2 text-xs text-ink-muted">
              {[
                "Free changes up to 2 hours before departure",
                "Full refund if you cancel 24 hours ahead",
                "Free reserved parking included",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <svg viewBox="0 0 16 16" aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ontime" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 rounded-[var(--radius)] border border-info/20 bg-info-bg px-4 py-3 text-xs leading-relaxed text-info-ink">
            <strong className="font-semibold">A park pass is separate.</strong> Every
            visitor to Banff National Park needs a valid Parks Canada pass regardless of
            how they travel. Buy one at{" "}
            <Link href="/faq" className="underline underline-offset-2">
              parks.canada.ca
            </Link>{" "}
            or at the park gates.
          </p>

          <p className="mt-3 text-center text-xs text-ink-subtle">
            Questions?{" "}
            <a
              href={`tel:${site.contact.tollFree}`}
              className="font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              {site.contact.tollFreeDisplay}
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}
