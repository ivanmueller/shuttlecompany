import { AlpineScene } from "@/components/brand/alpine-scene";
import { HeroPlanner } from "@/components/home/hero-search";
import { DepartureBoard, type BoardRow, type BoardFilter } from "@/components/home/departure-board";
import { routeBySlug } from "@/data/network";
import { site } from "@/config/site";
import { formatCad } from "@/lib/utils";

/**
 * Hero.
 *
 * The structural bet: this visitor is not deciding *whether* to go. They have
 * flights, a hotel and a rental car, and Parks Canada has just told them no.
 * Their only question is "can I get on a bus, and when?" — so the first
 * screen answers it with real departures rather than asking four questions
 * first.
 *
 * What changed and why:
 *  - The headline names the outcome (seats, today, frequency, price) instead
 *    of the mechanism. "Without a reservation" reads to an anxious first-time
 *    visitor as "no guaranteed seat", which is the exact fear that brought
 *    them here.
 *  - The sub-paragraph was six lines on a phone — 180px, a quarter of the
 *    visible screen — repeating what the headline and trust strip already
 *    say. It is one line now.
 *  - The proof strip carried four numbers, three of which were about us and
 *    one of which ("98.6% departed on time last season") a first-season
 *    operator cannot have. All four now answer a live question.
 *  - The board sits here, not five screens down, because it is the only
 *    element on the page that turns the claim into a fact.
 */
export function Hero({
  rows,
  dateISO,
  dateLabel,
  filters,
  serverNowMinutes,
}: {
  rows: BoardRow[];
  dateISO: string;
  dateLabel: string;
  filters: BoardFilter[];
  serverNowMinutes: number;
}) {
  const board = (
    <DepartureBoard
      rows={rows}
      dateISO={dateISO}
      dateLabel={dateLabel}
      filters={filters}
      serverNowMinutes={serverNowMinutes}
    />
  );

  const moraine = routeBySlug("moraine-lake-express");
  const fare = moraine?.fares.adult ?? 29;
  const headway = moraine?.headwayMinutes ?? 20;

  return (
    <section className="on-dark relative isolate overflow-hidden bg-brand-900">
      <AlpineScene className="absolute inset-0 size-full" />
      <div className="absolute inset-0 scrim-photo" aria-hidden />

      <div className="container-page relative pb-10 pt-8 md:pb-14 md:pt-14">
        <HeroPlanner
          board={board}
          fare={formatCad(fare)}
          headway={headway}
          guaranteeMinutes={site.guarantee.windowMinutes}
        />

        {/* Four facts, each answering a question someone is actually asking,
            and each checkable against the timetable further down this page. */}
        <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 text-white sm:grid-cols-4">
          {[
            { v: formatCad(fare), l: "round trip, per adult" },
            { v: "Free", l: `parking — ${site.proof.parkingSpaces}+ reserved spaces` },
            { v: "Any bus", l: "for your return, no fixed slot" },
            { v: "Under 6", l: "travel free on every route" },
          ].map((stat) => (
            <div key={stat.l}>
              <dt className="sr-only">{stat.l}</dt>
              <dd>
                <span className="text-on-photo block font-display text-[1.75rem] font-bold leading-none tabular">
                  {stat.v}
                </span>
                <span className="text-on-photo mt-1.5 block text-[0.8125rem] leading-snug text-white/80">
                  {stat.l}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
