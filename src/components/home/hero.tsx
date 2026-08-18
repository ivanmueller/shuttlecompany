import { HeroBackdrop } from "@/components/brand/hero-backdrop";
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
 *  - The board sits here, not five screens down, because it is the only
 *    element on the page that turns the claim into a fact.
 *  - The four-stat row is gone. It read as a summary of the offer, but every
 *    one of its four figures was already on screen or within two screens:
 *    "$29" is in the headline, "Any bus" is in the sub-paragraph, "Under 6
 *    free" is in the journey line under the origin picker, and free parking
 *    leads the section directly below. On a 390px phone it and the long
 *    sub-paragraph were what pushed the first bookable departure to 752px and
 *    the primary action to 1,239px — a screen and a half below the fold on
 *    the page whose stated principle is that the funnel starts above it.
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
      <HeroBackdrop />
      <div className="absolute inset-0 scrim-photo" aria-hidden />

      <div className="container-page relative pb-10 pt-8 md:pb-14 md:pt-14">
        <HeroPlanner
          board={board}
          fare={formatCad(fare)}
          headway={headway}
          guaranteeMinutes={site.guarantee.windowMinutes}
        />
      </div>
    </section>
  );
}
