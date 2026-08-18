"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { track, scrollDepth } from "@/lib/analytics";

export interface StickyDeparture {
  time: string;
  label: string;
  minutes: number;
  destination: string;
  routeSlug: string;
  fare: number;
}

/**
 * Persistent mobile CTA.
 *
 * Three things were wrong with this bar, and all three cost bookings:
 *
 *  1. It waited for `scrollY > 620`. Combined with a header CTA hidden below
 *     640px, a phone visitor had *no* booking action on screen for the whole
 *     first screen and a half — the exact stretch that carries the value
 *     proposition. It now arrives as soon as the headline clears.
 *  2. It advertised `Math.min()` across all fares, which is the $12 lakeshore
 *     route. Someone on their way to Moraine Lake saw $12 and met $29 one tap
 *     later: a 2.4x jump against a number this site set itself.
 *  3. "Book now" is a label, not a reason. A stated next departure is.
 *
 * It also no longer imports the network module — it took the entire transit
 * dataset into every page's client bundle to compute one minimum.
 */
export function StickyBookBar({ departures }: { departures: StickyDeparture[] }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const read = () => {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Edmonton",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      setNowMinutes(
        Number(parts.find((p) => p.type === "hour")?.value ?? 0) * 60 +
          Number(parts.find((p) => p.type === "minute")?.value ?? 0),
      );
    };
    read();
    const id = setInterval(read, 30_000);
    return () => clearInterval(id);
  }, []);

  /* Suppressed on the booking funnel, where a second competing call to action
     costs conversions rather than earning them. */
  if (pathname.startsWith("/book")) return null;

  const next =
    nowMinutes === null
      ? departures[0]
      : (departures.find((d) => d.minutes >= nowMinutes) ?? null);

  const href = next
    ? `/book?route=${next.routeSlug}&time=${next.time}`
    : "/book?to=moraine-lake";

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur transition-transform duration-200 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container-page flex min-w-0 items-center gap-3 py-3">
        <div className="min-w-0 flex-1">
          {next ? (
            <>
              <p className="truncate text-[0.8125rem] font-semibold text-ink">
                {next.label} to {next.destination} · ${next.fare}
              </p>
              <p className="flex items-center gap-1.5 truncate text-xs text-ink-muted">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-ontime" />
                {nowMinutes !== null && next.minutes - nowMinutes <= 1
                  ? "Boarding now"
                  : nowMinutes !== null
                    ? `Leaves in ${next.minutes - nowMinutes} min`
                    : "Seats released daily"}
              </p>
            </>
          ) : (
            <>
              <p className="truncate text-[0.8125rem] font-semibold text-ink">
                Today&apos;s service has finished
              </p>
              <p className="truncate text-xs text-ink-muted">
                Tomorrow&apos;s seats are open now
              </p>
            </>
          )}
        </div>
        <ButtonLink
          href={href}
          size="md"
          tabIndex={visible ? undefined : -1}
          className="shrink-0"
          onClick={() =>
            track({ name: "cta_clicked", id: "sticky-bar", scrollDepth: scrollDepth() })
          }
        >
          Book
        </ButtonLink>
      </div>
    </div>
  );
}
