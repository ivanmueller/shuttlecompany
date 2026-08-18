import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { WhyUs } from "@/components/home/why-us";
import { HowItWorks } from "@/components/home/how-it-works";
import { Credentials } from "@/components/home/credentials";
import { ClosingCta } from "@/components/home/closing-cta";
import { type BoardRow, type BoardFilter } from "@/components/home/departure-board";
import { RouteCard, FlagshipRouteCard } from "@/components/routes/route-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import {
  routes,
  routeBySlug,
  getDepartures,
  stopById,
} from "@/data/network";
import { featuredFaqs, faqs } from "@/data/faqs";
import { faqSchema, routeListSchema } from "@/lib/schema";
import { todayISO, formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Moraine Lake & Lake Louise Shuttle | Seats Released Daily`,
  description: `Scheduled buses to Moraine Lake every 20 minutes and Lake Louise every 15. Seats released daily, so you can still travel when the Parks Canada shuttle and Roam Transit are sold out. $29 round trip, free parking, open return.`,
  alternates: { canonical: "/" },
};

/** Re-render every 10 minutes so the departure board and availability stay
 *  current without rebuilding the whole site. The board additionally refines
 *  against the visitor's own clock on mount. */
export const revalidate = 600;

/** Park-time minute at render. Passed to the board so the first paint is
 *  roughly right — the server used to emit the whole day, so an afternoon
 *  visitor's first paint was six pre-dawn sunrise departures. */
function parkNowMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

/**
 * Home page.
 *
 * Seven sections, down from ten, and 48% shorter on a phone. The cuts were
 * not to detail — the detail converts — but to repetition. A claim audit
 * across the old page found the seat-release promise in eight of ten
 * sections, the open-return promise in seven and free parking in five;
 * `$29` appeared sixteen times and `Parks Canada` eighteen. Each instance
 * was individually defensible and the sum was noise, because a reader who
 * had understood the offer by the third screen kept meeting blocks that
 * looked new, checking them, and finding nothing.
 *
 * What moved, and why:
 *  - The compressed comparison and the trust strip ran back to back saying
 *    the same two things. They are one section now.
 *  - The full four-operator table is gone from here. It was never unique to
 *    this page: /parks-canada-shuttle-alternative and /how-to-get-to-moraine-lake
 *    both already render the same component, and this copy was 4,052px —
 *    a quarter of the entire phone page — of pure duplication.
 *  - Credentials moved from 68% down the page to directly after the routes.
 *    For an operator with no reviews yet, the safety certificate and the
 *    Parks Canada licence are the strongest trust asset on the site, and
 *    they were filed behind the longest section on it.
 *  - The six destination guides that sat *after* the closing call to action
 *    are gone. Six exits at the highest-intent moment on the page, and the
 *    footer already carries every one of them on every page, so removing
 *    them costs no internal link equity at all.
 */
export default function HomePage() {
  const today = todayISO();
  const now = parkNowMinutes();
  const flagship = routeBySlug("moraine-lake-express");
  const secondary = routes.filter((r) => r.slug !== "moraine-lake-express");

  /* Board rows. Only what is plausibly still ahead ships in the HTML — the
     whole day used to be serialised to render eight rows. */
  const boardRows: BoardRow[] = routes
    .flatMap((route) =>
      getDepartures(route, today)
        .filter((d) => d.minutes >= now - 5)
        .map((d) => ({
          routeNumber: route.number,
          routeName: route.name,
          routeSlug: route.slug,
          destination: stopById(route.destinationId).shortName,
          destinationId: route.destinationId,
          /* Where the rider stands, and when they get there. These are the
             only two facts that differ between rows once the board is
             filtered to a destination, and neither used to be on it. */
          originName: stopById(route.originId).shortName,
          minutes: d.minutes,
          time: d.time,
          label: d.label,
          arrivalLabel: d.arrivalLabel,
          seatsRemaining: d.seatsRemaining,
          availability: d.availability,
          capacity: route.capacity,
          fare: route.fares.adult,
          tripType: route.tripType,
        })),
    )
    .sort((a, b) => a.minutes - b.minutes);

  /* Moraine Lake first, because that is what people came for. Labels are
     short so four chips cannot overflow the board's 24rem desktop column —
     as a scroller they needed 470px inside 382px and the last one was
     sliced down its middle. */
  const filters: BoardFilter[] = [
    { id: "moraine-lake", label: "Moraine Lake" },
    { id: "ll-lakeshore", label: "Lake Louise" },
    { id: "ll-village", label: "Village" },
    { id: "all", label: "All" },
  ];

  return (
    <>
      <JsonLd data={routeListSchema()} />
      <JsonLd data={faqSchema(featuredFaqs)} />

      {/* 1. Can I get a seat, and when? */}
      <Hero
        rows={boardRows}
        dateISO={today}
        dateLabel={formatDateShort(today)}
        filters={filters}
        serverNowMinutes={now}
      />

      {/* 2. Why you, and not the shuttle I was trying to book? */}
      <Section tone="sunken">
        <WhyUs />
      </Section>

      {/* 3. From where I am. The hero's origin picker gets this right and
             this section used to throw that model away, reverting to a
             network diagram ordered by route number — leaving a visitor in
             Banff to derive for themselves that they need Route 4 and then
             Route 1. The cards lead with the journey now. */}
      <Section>
        <SectionHeading
          align="left"
          eyebrow="Every route to the lakes"
          title="Where are you starting from?"
          lede="Scheduled service, not a tour. Turn up, board, and go — the next bus is never more than half an hour away on any core route."
        />
        {flagship && <FlagshipRouteCard route={flagship} className="mt-10" />}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {secondary.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </Section>

      {/* 4. Are you a real bus company? Moved up from 68% down the page. */}
      <Section tone="sunken">
        <Credentials />
      </Section>

      {/* 5. What actually happens on the day? */}
      <Section>
        <HowItWorks />
      </Section>

      {/* 6. The last five objections, and nothing the page already answered. */}
      <Section tone="sunken">
        <div className="grid gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Before you book"
              title="The questions everyone asks"
              lede="Cell service, park passes, missed buses, and doing both lakes in a day."
            />
            {/* The only button here used to be an exit to /faq, at the exact
                moment a reader has stopped objecting. */}
            <ButtonLink href="/book" size="lg" className="mt-6">
              Book a seat
            </ButtonLink>
            <Link
              href="/faq"
              className="mt-4 inline-block py-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Read all {faqs.length} answers →
            </Link>
          </div>
          <FaqAccordion items={featuredFaqs} />
        </div>
      </Section>

      {/* 7. The close, and the last thing on the page. Six destination-guide
             links used to sit below this point; the footer carries all of
             them on every page, so they lost nothing by going. */}
      <ClosingCta />
    </>
  );
}
