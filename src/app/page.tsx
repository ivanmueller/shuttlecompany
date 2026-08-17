import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { ComparisonTable } from "@/components/home/comparison";
import { HowItWorks } from "@/components/home/how-it-works";
import { DepartureBoard, type BoardRow } from "@/components/home/departure-board";
import { RouteCard } from "@/components/routes/route-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { routes, getDepartures, stopById, totalDailyDepartures } from "@/data/network";
import { featuredFaqs } from "@/data/faqs";
import { faqSchema, routeListSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { todayISO, formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${site.name} — Moraine Lake & Lake Louise Shuttle | No Reservation Needed`,
  description: `Shuttles to Moraine Lake and Lake Louise every 15–30 minutes. Seats released daily, so you can travel even if the Parks Canada shuttle and Roam Transit are sold out. Free parking, open return times, from $12.`,
  alternates: { canonical: "/" },
};

/** Re-render every 10 minutes so the departure board and availability stay
 *  current without rebuilding the whole site. */
export const revalidate = 600;

export default function HomePage() {
  const today = todayISO();

  /* Merge every route's departures into one chronological board. */
  const boardRows: BoardRow[] = routes
    .flatMap((route) =>
      getDepartures(route, today).map((d) => ({
        routeNumber: route.number,
        routeName: route.name,
        routeSlug: route.slug,
        destination: stopById(route.destinationId).shortName,
        minutes: d.minutes,
        time: d.time,
        label: d.label,
        seatsRemaining: d.seatsRemaining,
        capacity: route.capacity,
      })),
    )
    .sort((a, b) => a.minutes - b.minutes);

  return (
    <>
      <JsonLd data={routeListSchema()} />
      <JsonLd data={faqSchema(featuredFaqs)} />

      <Hero />
      <TrustStrip />

      {/* Routes + live board, side by side. The board is the proof and the
          cards are the offer; keeping them on one screen is what turns
          "sounds convenient" into a click. */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          <div>
            <SectionHeading
              align="left"
              eyebrow={`${routes.length} routes · ${totalDailyDepartures()} departures a day`}
              title="Pick your route"
              lede="Scheduled service, not a tour. Turn up, board, and go — the next bus is never more than half an hour away on any core route."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <DepartureBoard rows={boardRows} dateLabel={formatDateShort(today)} />
            <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
              Seat counts update continuously. A departure showing four seats or fewer
              has typically sold out within the hour during July and August.
            </p>
          </aside>
        </div>
      </Section>

      <Section tone="sunken">
        <ComparisonTable />
      </Section>

      <Section>
        <HowItWorks />
      </Section>

      {/* Destination guides. These exist for search as much as for riders —
          internal links to the keyword pages from a high-authority position. */}
      <Section tone="sunken">
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

      <Section>
        <div className="grid gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Before you book"
              title="The questions everyone asks"
              lede="The full list runs to thirty answers, covering parking, pets, park passes and what happens when the road closes."
            />
            <ButtonLink href="/faq" variant="outline" size="md" className="mt-6">
              Read all {featuredFaqs.length > 0 ? "30+" : ""} answers
            </ButtonLink>
          </div>
          <FaqAccordion items={featuredFaqs} />
        </div>
      </Section>

      {/* Closing CTA. */}
      <section className="relative isolate overflow-hidden bg-brand-900 py-20 text-white md:py-28">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,var(--brand-700),transparent_60%)]"
        />
        <div className="container-page relative text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]">
            The next bus to Moraine Lake leaves in under twenty minutes
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
            No reservation window, no waiting list, no fixed return time. Pick a
            departure and go.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/book" size="lg">
              Book a seat
            </ButtonLink>
            <ButtonLink href="/routes" variant="quiet" size="lg">
              See all timetables
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Free changes up to 2 hours before departure · No booking fee · Season{" "}
            {site.season.label}
          </p>
        </div>
      </section>
    </>
  );
}
