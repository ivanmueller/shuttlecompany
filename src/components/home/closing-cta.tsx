"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { getDepartures, routeBySlug, formatMinutesLabel } from "@/data/network";
import { track, scrollDepth } from "@/lib/analytics";
import { site } from "@/config/site";
import { todayISO, formatCad } from "@/lib/utils";

/**
 * Closing CTA.
 *
 * The headline used to be hard-coded: "The next bus to Moraine Lake leaves in
 * under twenty minutes." That sentence is trying to be a countdown and
 * failing — it is false every night after 19:20, false all winter, and false
 * on any day Route 1 is disrupted.
 *
 * It now reads from the same generator the board reads, so the two can never
 * disagree, and it degrades honestly outside service hours. Real scarcity,
 * stated plainly, is the strongest urgency device available here and it costs
 * nothing: the buses genuinely do run every twenty minutes.
 */
export function ClosingCta() {
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);
  const route = routeBySlug("moraine-lake-express");

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

  let headline = "The next bus to Moraine Lake is a tap away";
  let lede =
    "No reservation window, no waiting list, no fixed return time. Pick a departure and go.";

  if (route && nowMinutes !== null) {
    const next = getDepartures(route, todayISO()).find((d) => d.minutes >= nowMinutes);
    if (next) {
      const mins = next.minutes - nowMinutes;
      headline =
        mins <= 1
          ? "The next bus to Moraine Lake is boarding now"
          : `The next bus to Moraine Lake leaves in ${mins} minutes`;
      lede = `${next.label} from Lake Louise Village, ${formatCad(route.fares.adult)} round trip. No reservation window, no fixed return time.`;
    } else {
      headline = "Today's last bus has gone — tomorrow's are open";
      lede = `First departure tomorrow is ${formatMinutesLabel(route.firstDeparture)}, and the sunrise service runs from 3:45 am. Seats are released daily.`;
    }
  }

  return (
    <section className="on-dark relative isolate overflow-hidden bg-brand-900 py-20 text-white md:py-28">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,var(--brand-700),transparent_60%)]"
      />
      <div className="container-page relative text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]">
          {headline}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{lede}</p>

        {/* One action. "See all timetables" used to sit beside the buy button
            at the single highest-intent moment on the page; it lives in the
            footer now. */}
        <div className="mt-9 flex justify-center">
          <ButtonLink
            href="/book?to=moraine-lake"
            size="lg"
            onClick={() =>
              track({ name: "cta_clicked", id: "closing", scrollDepth: scrollDepth() })
            }
          >
            Book a seat
          </ButtonLink>
        </div>

        <p className="mt-6 text-sm text-white/70">
          Free changes up to 2 hours before departure · No booking fee · Seat guarantee
          within {site.guarantee.windowMinutes} minutes · Season {site.season.label}
        </p>
      </div>
    </section>
  );
}
