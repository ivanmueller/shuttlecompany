import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { ComparisonTable } from "@/components/home/comparison";
import { QuickComparison } from "@/components/home/quick-comparison";
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
  totalDailyDepartures,
} from "@/data/network";
import { featuredFaqs, faqs } from "@/data/faqs";
import { faqSchema, routeListSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { todayISO, formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${site.name} — Moraine Lake & Lake Louise Shuttle | Seats Released Daily`,
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
          minutes: d.minutes,
          time: d.time,
          label: d.label,
          seatsRemaining: d.seatsRemaining,
          availability: d.availability,
          capacity: route.capacity,
          fare: route.fares.adult,
        })),
    )
    .sort((a, b) => a.minutes - b.minutes);

  /* Moraine Lake first, because that is what people came for. The board used
     to merge every route chronologically, which made it 38% lakeshore. */
  const filters: BoardFilter[] = [
    { id: "moraine-lake", label: "Moraine Lake" },
    { id: "ll-lakeshore", label: "Lake Louise" },
    { id: "ll-village", label: "Village & Banff" },
    { id: "all", label: "Everything" },
  ];

  return (
    <>
      <JsonLd data={routeListSchema()} />
      <JsonLd data={faqSchema(featuredFaqs)} />

      <Hero
        rows={boardRows}
        dateISO={today}
        dateLabel={formatDateShort(today)}
        filters={filters}
        serverNowMinutes={now}
      />

      {/* The comparison, compressed, directly under the hero — it answers the
          question that brought the visitor and the full table is six screens
          further down than most people scroll. */}
      <Section tone="sunken">
        <QuickComparison />
      </Section>

      <TrustStrip />

      {/* Routes. Route 1 is the business; the other four used to carry the
          same visual weight and the same two buttons, which made the visitor
          work to find the thing they already came for. */}
      <Section>
        <SectionHeading
          align="left"
          eyebrow={`${routes.length} routes · ${totalDailyDepartures()} departures a day`}
          title="Pick your route"
          lede="Scheduled service, not a tour. Turn up, board, and go — the next bus is never more than half an hour away on any core route."
        />
        {flagship && <FlagshipRouteCard route={flagship} className="mt-10" />}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {secondary.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </Section>

      <Section>
        <HowItWorks />
      </Section>

      <Section tone="sunken">
        <ComparisonTable />
      </Section>

      <Section>
        <Credentials />
      </Section>

      <Section tone="sunken">
        <div className="grid gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Before you book"
              title="The questions everyone asks"
              lede="Parking, pets, park passes, and what happens when the road closes."
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

      <ClosingCta />

      {/* Destination guides. These exist for search as much as for riders, and
          they sit below the close: six links out of the funnel, placed at the
          point of highest intent, is six invitations to leave. Internal links
          pass equity from any position, and the footer carries every one of
          them on every page. */}
      <Section>
        <SectionHeading
          eyebrow="Planning your day"
          title="Everything you need to know before you go"
          lede="Written by people who run the road every day, not scraped from a tourism board."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/how-to-get-to-moraine-lake",
              title: "How to get to Moraine Lake in 2026",
              body: "Every legal way in, what each one costs, and which ones actually have availability this week.",
            },
            {
              href: "/parks-canada-shuttle-alternative",
              title: "Missed the Parks Canada reservation?",
              body: "What the release windows are, why they sell out in minutes, and what to do the day you find out.",
            },
            {
              href: "/roam-transit-alternative",
              title: "Roam Transit sold out?",
              body: "Roam is excellent and often full. Here is how the two services fit together on the Banff corridor.",
            },
            {
              href: "/moraine-lake-sunrise",
              title: "Moraine Lake sunrise guide",
              body: "What time first light actually hits the Ten Peaks, month by month, and when to leave the village.",
            },
            {
              href: "/lake-louise-shuttle",
              title: "Lake Louise lakeshore, without the parking",
              body: "The lot fills before 7:00 am most summer days. The 15-minute shuttle makes it a non-issue.",
            },
            {
              href: "/banff-to-lake-louise-bus",
              title: "Banff to Lake Louise by bus",
              body: "Every operator on the corridor, journey times, fares, and how to connect through to Moraine Lake.",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-[var(--radius)] border border-line bg-paper p-5 transition-all duration-200 hover:border-brand-300 hover:shadow-[var(--shadow-card)]"
            >
              <h3 className="font-sans text-[1.0625rem] font-bold leading-snug text-ink group-hover:text-brand-700">
                {card.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {card.body}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                Read the guide
                <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
