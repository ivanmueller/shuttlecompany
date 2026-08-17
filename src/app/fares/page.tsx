import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { routes, headwayLabel } from "@/data/network";
import { site } from "@/config/site";
import { formatCad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fares — Moraine Lake & Lake Louise Shuttle Prices",
  description: `Every fare, no booking fee, taxes included. Moraine Lake from $29 round trip, Lake Louise lakeshore from $12, Banff connector from $19. Children under 6 travel free.`,
  alternates: { canonical: "/fares" },
};

const fareRows = [
  { label: "Adult", sub: "18–64", key: "adult" as const },
  { label: "Senior", sub: "65+", key: "senior" as const },
  { label: "Youth", sub: "6–17", key: "youth" as const },
  { label: "Child", sub: "Under 6", key: "child" as const },
];

export default function FaresPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Fares", path: "/fares" },
        ])}
      />

      <PageHeader
        eyebrow="Pricing"
        title="Fares"
        lede="The price you see is the price you pay. No booking fee, no fuel surcharge, no seat-selection upsell, and taxes are already in the number."
        breadcrumbs={[{ name: "Fares", path: "/fares" }]}
      />

      <Section className="py-12 md:py-16">
        <div className="overflow-x-auto rounded-[var(--radius)] border border-line">
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <caption className="sr-only">
              Fares by route and passenger type, in Canadian dollars
            </caption>
            <thead>
              <tr className="bg-sunken text-left">
                <th scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle">
                  Route
                </th>
                {fareRows.map((r) => (
                  <th key={r.key} scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle">
                    {r.label}
                    <span className="mt-0.5 block text-[0.625rem] font-medium normal-case tracking-normal text-ink-subtle">
                      {r.sub}
                    </span>
                  </th>
                ))}
                <th scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle">
                  Trip type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {routes.map((route) => (
                <tr key={route.id}>
                  <th scope="row" className="px-5 py-4 text-left">
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="grid size-7 shrink-0 place-items-center rounded bg-brand-800 text-xs font-bold text-white tabular"
                      >
                        {route.number}
                      </span>
                      <span>
                        <Link
                          href={`/routes/${route.slug}`}
                          className="font-semibold text-ink hover:text-brand-700 hover:underline"
                        >
                          {route.name}
                        </Link>
                        <span className="mt-0.5 block text-xs font-normal text-ink-subtle">
                          {headwayLabel(route)}
                        </span>
                      </span>
                    </span>
                  </th>
                  {fareRows.map((r) => (
                    <td key={r.key} className="px-5 py-4 font-semibold text-ink tabular">
                      {formatCad(route.fares[r.key])}
                    </td>
                  ))}
                  <td className="px-5 py-4 text-ink-muted">
                    {route.tripType === "round-trip" ? "Round trip" : "One way"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "What's included",
              body: "Free reserved parking at your departure stop, an open return on round-trip routes, and free changes up to 2 hours before you travel.",
            },
            {
              title: "What isn't",
              body: "The Parks Canada park pass. Every visitor to Banff National Park needs one regardless of how they travel — roughly $11 per adult per day, or $75 for an annual Discovery Pass.",
            },
            {
              title: "Groups and charters",
              body: "Groups of 12 or more get a discounted rate. Full-vehicle charters are available for weddings, conferences and film crews. Email us with dates and headcount.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-[var(--radius)] border border-line p-5">
              <h2 className="font-sans text-[1.0625rem] font-bold text-ink">{card.title}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sunken" className="py-14 md:py-20">
        <SectionHeading
          eyebrow="Changes and refunds"
          title="What happens if your plans change"
          lede="Mountain weather, delayed flights and slower-than-expected hikes are all normal. Our policy is written on the assumption that they will happen."
        />
        <dl className="mx-auto mt-10 max-w-3xl divide-y divide-line border-y border-line">
          {[
            ["More than 24 hours before departure", "Change free, or cancel for a full refund to your original payment method."],
            ["Between 24 and 2 hours before", "Change your date or time free of charge. Cancellations receive a credit valid for the rest of the season."],
            ["Less than 2 hours before", "No changes. Seats are limited and someone else could have travelled."],
            ["If we cancel", "Automatic full refund, plus the next available seat if you still want to travel. You will get a text before you leave for the stop."],
            ["If you miss the bus", "Come to the kiosk. We will put you on the next departure with a free seat at no charge — usually within 20 minutes on Route 1."],
          ].map(([term, def]) => (
            <div key={term} className="grid gap-2 py-5 md:grid-cols-[16rem_1fr] md:gap-6">
              <dt className="font-semibold text-ink">{term}</dt>
              <dd className="leading-relaxed text-ink-muted">{def}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 text-center">
          <ButtonLink href="/book" size="lg">
            Book a seat
          </ButtonLink>
          <p className="mt-3 text-sm text-ink-subtle">
            Questions about a group booking? Email{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-semibold text-brand-700 underline underline-offset-4"
            >
              {site.contact.email}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
