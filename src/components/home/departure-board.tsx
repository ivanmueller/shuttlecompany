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
  minutes: number;
  time: string;
  label: string;
  seatsRemaining: number;
  availability: Availability;
  capacity: number;
  fare: number;
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
 * Four things this had to fix:
 *
 *  - **It advertised the wrong product.** Merging every route chronologically
 *    made the board 38% Lake Louise lakeshore ($12) and only 31% Moraine
 *    Lake; typically two of eight visible rows went where the visitor was
 *    going. It now defaults to one destination and offers the others as
 *    filters.
 *  - **Rows jumped under the thumb.** The clock ticks every 30 seconds and
 *    re-filtered the list, so the instant a departure passed every row shifted
 *    up ~54px — mid-tap. The list is now frozen while a pointer is over it.
 *  - **Every row threw away the time.** Links carried `?time=` that /book
 *    ignored. They now carry the date too, and /book preselects.
 *  - **Pre-hydration it showed 3:45 am.** The server emits the whole day, so
 *    an afternoon visitor's first paint was six pre-dawn sunrise buses. The
 *    server now emits only what is plausibly ahead, and the client refines.
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
              {next.destination} in{" "}
              <span className="font-display font-bold text-accent-400 tabular">
                {minutesUntil <= 0 ? "boarding now" : `${minutesUntil} min`}
              </span>{" "}
              <span className="text-white/60">· {next.label}</span>
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
        <div className="flex min-w-0 gap-2 overflow-x-auto border-b border-white/10 px-5 py-2.5 hide-scrollbar">
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
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
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
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-md bg-white/10 text-xs font-bold tabular"
                >
                  {row.routeNumber}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">
                    {row.destination}
                  </span>
                  <span className="block truncate text-xs text-white/60">
                    ${row.fare} · {row.routeName}
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
