"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SeatsPill } from "@/components/ui/status-pill";
import type { Availability } from "@/data/network";
import { track, scrollDepth } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface BoardRow {
  routeNumber: string;
  routeName: string;
  routeSlug: string;
  destination: string;
  /** Grouping key for the destination filter. */
  destinationId: string;
  /** Where the rider actually stands. This is the fact a row is chosen on. */
  originName: string;
  minutes: number;
  time: string;
  label: string;
  arrivalLabel: string;
  seatsRemaining: number;
  availability: Availability;
  capacity: number;
  fare: number;
  tripType: "round-trip" | "one-way";
}

export interface BoardFilter {
  id: string;
  label: string;
}

/**
 * Live departure board.
 *
 * Modelled on the flip-boards riders already trust in a terminal. It is the
 * cheapest possible proof of the entire value proposition: a visitor who has
 * just been told "every 20 minutes" can see the next real departures and
 * stops reading the marketing copy.
 *
 * The rows used to spend their width printing constants. With the default
 * filter selected — which is where nearly everyone lands — the destination,
 * the route name and the fare were identical on all six rows, and the route
 * name was clipped on every one of them at every breakpoint: "$29 · Moraine
 * Lake Express" needs 163px and was given 65px on a 390px phone. Six rows
 * differing only in a timestamp, three-fifths of each row spent re-printing
 * the filter chip the visitor had just pressed.
 *
 * So anything uniform across the visible rows is stated once, in the header,
 * and the width goes to the two facts that actually distinguish one departure
 * from another: **where you board** and **when you arrive**. Uniformity is
 * computed rather than assumed — the Moraine Lake filter carries both the $29
 * Route 1 and the $49 sunrise service, so before dawn the fare is per-row
 * again and the header stops claiming a single price.
 */
export function DepartureBoard({
  rows,
  dateISO,
  dateLabel,
  filters,
  serverNowMinutes,
}: {
  rows: BoardRow[];
  dateISO: string;
  dateLabel: string;
  filters?: BoardFilter[];
  /** Park-time minute at render, so the first paint is roughly right. */
  serverNowMinutes: number;
}) {
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);
  const [destinationId, setDestinationId] = useState(filters?.[0]?.id ?? "all");
  /* Pointer-over snapshot of the clock. Freezing the *reference time* rather
     than a copy of the rows keeps the render pure and achieves the same
     thing: nothing can shift while a thumb is descending. */
  const [frozenNow, setFrozenNow] = useState<number | null>(null);

  useEffect(() => {
    const read = () => {
      // Park time, not the visitor's device timezone — someone booking from
      // Tokyo needs to see the Mountain Time board, not their own.
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Edmonton",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
      const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      setNowMinutes(h * 60 + m);
    };
    read();
    const id = setInterval(read, 30_000);
    return () => clearInterval(id);
  }, []);

  const effectiveNow = nowMinutes ?? serverNowMinutes;
  const live = nowMinutes !== null;

  const matching = rows.filter(
    (r) => destinationId === "all" || r.destinationId === destinationId,
  );
  /* The clock ticks every 30 seconds and re-filters this list. Without the
     freeze, the instant a departure passed every row shifted up by one —
     about 54px — mid-tap, and someone aiming at 9:40 booked 10:00. */
  const referenceNow = frozenNow ?? effectiveNow;
  const upcoming = matching.filter((r) => r.minutes >= referenceNow);
  const visible = upcoming.slice(0, 6);

  const next = visible[0];
  const minutesUntil = next ? next.minutes - effectiveNow : null;
  const soldOutToday = matching.filter((r) => r.availability === "sold-out").length;

  /* What is genuinely constant across the rows on screen right now. Only
     these get promoted into the header; everything else stays per-row, so
     the board can never state a price or a destination that some visible
     row contradicts. */
  const sharedDestination =
    visible.length > 0 && visible.every((r) => r.destinationId === next.destinationId)
      ? next.destination
      : null;
  const sharedFare =
    visible.length > 0 && visible.every((r) => r.fare === next.fare) ? next.fare : null;
  const sharedTripType =
    visible.length > 0 && visible.every((r) => r.tripType === next.tripType)
      ? next.tripType
      : null;

  return (
    <div className="on-dark overflow-hidden rounded-[calc(var(--radius)+0.2rem)] border border-brand-800/40 bg-brand-950 text-white shadow-[var(--shadow-lift)]">
      {/* Header carries the countdown rather than a separate bordered row.
          On a 390px phone those 44px are the difference between the first
          bookable departure clearing the fold and sitting just under it. */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-white/10 px-5 py-3">
        <div className="min-w-0">
          <h2 className="font-sans text-[0.9375rem] font-bold uppercase tracking-[0.12em] text-white">
            Next departures
          </h2>
          {next && minutesUntil !== null ? (
            <p className="mt-0.5 text-[0.8125rem] text-white/85">
              {/* Destination and fare, stated once for the whole board. */}
              {sharedDestination ? `To ${sharedDestination}` : "All routes"}
              {sharedFare !== null && (
                <span className="text-white/60">
                  {" · "}
                  <span className="tabular">${sharedFare}</span>
                  {sharedTripType === "round-trip" ? " round trip" : " one way"}
                </span>
              )}
              {" · "}
              <span className="font-display font-bold text-accent-400 tabular">
                {minutesUntil <= 0 ? "boarding now" : `${minutesUntil} min`}
              </span>
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-white/70">{dateLabel} · Mountain Time</p>
          )}
        </div>
        <p className="flex shrink-0 items-center gap-2 text-xs font-semibold text-white/90">
          <span
            aria-hidden
            className={cn("size-1.5 rounded-full bg-ontime", live && "animate-pulse")}
          />
          {/* "Live" is a promise. Before the visitor's own clock is available
              this is today's published timetable, and says so. */}
          {live ? "Live" : "Today's service"}
        </p>
      </div>

      {filters && filters.length > 1 && (
        /* Wraps rather than scrolls. As a scroller these four chips needed
           470px inside a 382px column, so at desktop width the last one was
           sliced down its middle with `hide-scrollbar` hiding the only cue
           that it could be scrolled to. Wrapping cannot clip. */
        <div className="flex min-w-0 flex-wrap gap-1 border-b border-white/10 px-5 py-2.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setDestinationId(f.id);
                track({ name: "board_filtered", destination: f.id });
              }}
              aria-pressed={destinationId === f.id}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                destinationId === f.id
                  ? "border-accent-400 bg-accent-400 text-ink"
                  : "border-white/25 text-white/80 hover:border-white/50",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-white/80">
            Service has finished for today.
          </p>
          <Link
            href={`/book?to=${destinationId === "all" ? "moraine-lake" : destinationId}`}
            className="mt-3 inline-block text-sm font-semibold text-accent-400 underline-offset-4 hover:underline"
          >
            Book tomorrow&apos;s first bus →
          </Link>
        </div>
      ) : (
        <ul
          className="divide-y divide-white/10"
          onPointerEnter={() => setFrozenNow(effectiveNow)}
          onPointerLeave={() => setFrozenNow(null)}
        >
          {visible.map((row) => (
            <li key={`${row.routeSlug}-${row.time}`}>
              <Link
                href={`/book?route=${row.routeSlug}&time=${row.time}&date=${dateISO}`}
                onClick={() =>
                  track({
                    name: "departure_selected",
                    route: row.routeSlug,
                    time: row.time,
                    availability: row.availability,
                    minutesUntil: row.minutes - effectiveNow,
                    surface: "board",
                  })
                }
                className="flex min-w-0 items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/5"
              >
                <span className="w-16 shrink-0 font-display text-lg font-bold tabular">
                  {row.label.replace(" am", "").replace(" pm", "")}
                  <span className="ml-0.5 text-[0.625rem] font-semibold uppercase text-white/60">
                    {row.label.slice(-2)}
                  </span>
                </span>
                {/* The two facts that differ between rows. The route-number
                    badge that used to sit here is our dispatcher's label —
                    it was rendered six times and told a first-time visitor
                    nothing. */}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">
                    {sharedDestination ? row.originName : row.destination}
                  </span>
                  <span className="block truncate text-xs text-white/60">
                    {sharedDestination ? "arrives " : "from "}
                    <span className="tabular">
                      {sharedDestination ? row.arrivalLabel : row.originName}
                    </span>
                    {sharedFare === null && (
                      <span className="tabular"> · ${row.fare}</span>
                    )}
                  </span>
                </span>
                {/* `min-w-0` on the pill is what stopped the whole document
                    being 56px wider than a 390px phone: these rows had a
                    min-content width of 426px and this is the last piece. */}
                <SeatsPill
                  availability={row.availability}
                  seats={row.seatsRemaining}
                  className="min-w-0 shrink"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Scarcity as evidence, with the way through attached. A board that
          only reports sold-out rows makes us look as unavailable as the
          operator the visitor just left. */}
      {soldOutToday > 0 && (
        <p className="border-t border-white/10 px-5 py-3 text-xs leading-relaxed text-white/70">
          {soldOutToday} of today&apos;s {matching.length} departures are full. That is
          why we run {matching.length}.
        </p>
      )}

      <div className="border-t border-white/10 px-5 py-3.5">
        <Link
          href="/routes"
          onClick={() => track({ name: "cta_clicked", id: "board-all-timetables", scrollDepth: scrollDepth() })}
          className="inline-block py-1 text-sm font-semibold text-accent-400 underline-offset-4 hover:underline"
        >
          Every route and full timetables →
        </Link>
      </div>
    </div>
  );
}
