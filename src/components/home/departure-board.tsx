"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SeatsPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

export interface BoardRow {
  routeNumber: string;
  routeName: string;
  routeSlug: string;
  destination: string;
  minutes: number;
  time: string;
  label: string;
  seatsRemaining: number;
  capacity: number;
}

/**
 * Live departure board.
 *
 * Modelled on the flip-boards riders already trust in a terminal. It is the
 * cheapest possible proof of the entire value proposition: a visitor who has
 * just been told "every 20 minutes" can see fourteen real departures still to
 * come today, and stops reading the marketing copy.
 *
 * Rendering strategy: the server emits today's full list so the content is in
 * the HTML for crawlers and for anyone before hydration. After mount we filter
 * to departures still ahead of the visitor's own clock, which is the honest
 * version of "next departures" — the server has no idea what time it is where
 * they are standing.
 */
export function DepartureBoard({
  rows,
  dateLabel,
}: {
  rows: BoardRow[];
  dateLabel: string;
}) {
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

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

  const upcoming =
    nowMinutes === null ? rows : rows.filter((r) => r.minutes >= nowMinutes);
  const visible = upcoming.slice(0, 8);
  const live = nowMinutes !== null;

  return (
    <div className="overflow-hidden rounded-[calc(var(--radius)+0.2rem)] border border-brand-800/40 bg-brand-950 text-white shadow-[var(--shadow-lift)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <h3 className="font-sans text-[0.9375rem] font-bold uppercase tracking-[0.12em] text-white">
            Departures
          </h3>
          <p className="mt-0.5 text-xs text-white/55">
            {dateLabel} · Mountain Time
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs font-semibold text-white/80">
          <span
            aria-hidden
            className={cn(
              "size-1.5 rounded-full bg-ontime",
              live && "animate-pulse",
            )}
          />
          {live ? "Live" : "Today's service"}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-white/70">
            Service has finished for today. First bus tomorrow is at 3:45 am.
          </p>
          <Link
            href="/book"
            className="mt-3 inline-block text-sm font-semibold text-accent-400 underline-offset-4 hover:underline"
          >
            Book tomorrow&apos;s departure →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/10">
          {visible.map((row) => (
            <li key={`${row.routeSlug}-${row.time}`}>
              <Link
                href={`/book?route=${row.routeSlug}&time=${row.time}`}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/5"
              >
                <span className="w-16 shrink-0 font-display text-lg font-bold tabular">
                  {row.label.replace(" am", "").replace(" pm", "")}
                  <span className="ml-0.5 text-[0.625rem] font-semibold uppercase text-white/50">
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
                  <span className="block truncate text-xs text-white/50">
                    {row.routeName}
                  </span>
                </span>
                <SeatsPill
                  seats={row.seatsRemaining}
                  capacity={row.capacity}
                  className="shrink-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-white/10 px-5 py-3.5">
        <Link
          href="/routes"
          className="text-sm font-semibold text-accent-400 underline-offset-4 hover:underline"
        >
          Every route and full timetables →
        </Link>
      </div>
    </div>
  );
}
