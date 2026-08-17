import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { Timetable } from "@/components/schedule/timetable";
import { ButtonLink } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { busTripSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import {
  routes,
  routeBySlug,
  stopById,
  dailyDepartureCount,
  headwayLabel,
  serviceWindowLabel,
} from "@/data/network";
import { faqs } from "@/data/faqs";
import { site } from "@/config/site";
import { todayISO, formatCad } from "@/lib/utils";

export const revalidate = 600;

export function generateStaticParams() {
  return routes.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = routeBySlug(slug);
  if (!route) return {};

  const origin = stopById(route.originId);
  const destination = stopById(route.destinationId);

  return {
    title: `Route ${route.number}: ${origin.shortName} to ${destination.shortName} — ${headwayLabel(route)}`,
    description: `${route.name}. ${headwayLabel(route)} from ${serviceWindowLabel(route)}, ${dailyDepartureCount(route)} departures daily. ${formatCad(route.fares.adult)} per adult ${route.tripType}. Full timetable and live seat availability.`,
    alternates: { canonical: `/routes/${route.slug}` },
    openGraph: {
      title: `Route ${route.number}: ${route.name}`,
      description: `${headwayLabel(route)} · ${dailyDepartureCount(route)} departures daily · from ${formatCad(route.fares.adult)}`,
      url: `${site.url}/routes/${route.slug}`,
    },
  };
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = routeBySlug(slug);
  if (!route) notFound();

  const today = todayISO();
  const others = routes.filter((r) => r.id !== route.id);

  /* Route-relevant FAQs only — a 30-item accordion on a route page buries
     the timetable, which is what the visitor came for. */
  const relevantFaqs = faqs.filter((f) =>
    route.slug.includes("moraine")
      ? f.topic === "moraine" || f.topic === "booking"
      : route.slug.includes("lake-louise") || route.slug.includes("lakeshore")
        ? f.topic === "lake-louise" || f.topic === "booking"
        : f.topic === "getting-here" || f.topic === "booking",
  ).slice(0, 6);

  return (
    <>
      <JsonLd data={busTripSchema(route)} />
      <JsonLd data={faqSchema(relevantFaqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Routes", path: "/routes" },
          { name: `Route ${route.number}`, path: `/routes/${route.slug}` },
        ])}
      />

      <PageHeader
        eyebrow={`Route ${route.number}`}
        title={route.name}
        lede={route.summary}
        breadcrumbs={[
          { name: "Routes", path: "/routes" },
          { name: `Route ${route.number}`, path: `/routes/${route.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href={`/book?route=${route.slug}`} size="lg">
            Book from {formatCad(route.fares.adult)}
          </ButtonLink>
          <StatusPill status={route.status} />
          {route.statusNote && (
            <p className="w-full text-sm text-delay-ink md:w-auto">{route.statusNote}</p>
          )}
        </div>
      </PageHeader>

      {/* Key facts. A rider scanning for one number should find it without
          reading a paragraph. */}
      <section className="border-b border-line bg-paper">
        <div className="container-page">
          <dl className="grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
            {[
              { label: "Frequency", value: headwayLabel(route) },
              { label: "Departures daily", value: String(dailyDepartureCount(route)) },
              { label: "Journey time", value: `${route.durationMinutes} min` },
              {
                label: "Adult fare",
                value: `${formatCad(route.fares.adult)} ${route.tripType === "round-trip" ? "return" : "one way"}`,
              },
            ].map((fact, i) => (
              <div
                key={fact.label}
                className={`py-6 md:px-6 ${i % 2 === 0 ? "pr-4" : "pl-4 md:pl-6"} ${i === 0 ? "md:pl-0" : ""}`}
              >
                <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 font-display text-xl font-bold text-ink tabular">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <Timetable route={route} dateISO={today} />

            <p className="mt-4 rounded-[var(--radius)] border border-info/20 bg-info-bg px-4 py-3 text-sm leading-relaxed text-info-ink">
              Timetable shown for today. Availability changes through the day — pick your
              date on the{" "}
              <Link
                href={`/book?route=${route.slug}`}
                className="font-semibold underline underline-offset-4"
              >
                booking page
              </Link>{" "}
              to see live seats for any date this season.
            </p>

            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold text-ink">
                Stops on this route
              </h2>
              <ol className="mt-6 space-y-6 border-l-2 border-brand-200 pl-6">
                {route.stopIds.map((stopId, i) => {
                  const stop = stopById(stopId);
                  return (
                    <li key={stopId} className="relative">
                      <span
                        aria-hidden
                        className="absolute -left-[1.9375rem] top-1 grid size-6 place-items-center rounded-full border-2 border-brand-600 bg-paper text-[0.625rem] font-bold text-brand-700"
                      >
                        {i + 1}
                      </span>
                      <h3 className="font-sans text-[1.0625rem] font-bold text-ink">
                        {stop.name}
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted">{stop.boarding}</p>
                      {stop.parkingNote && (
                        <p
                          className={`mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                            stop.parking === "free-guaranteed"
                              ? "bg-ontime-bg text-ontime-ink"
                              : stop.parking === "none"
                                ? "bg-issue-bg text-issue-ink"
                                : "bg-delay-bg text-delay-ink"
                          }`}
                        >
                          {stop.parkingNote}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius)] border border-line bg-sunken p-6">
              <h2 className="font-display text-lg font-bold text-ink">
                What&apos;s included
              </h2>
              <ul className="mt-4 space-y-3">
                {route.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                    <svg viewBox="0 0 16 16" aria-hidden className="mt-1 size-4 shrink-0 text-ontime" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8.5 6.5 12 13 4.5" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href={`/book?route=${route.slug}`} size="lg" className="mt-6 w-full">
                Book Route {route.number}
              </ButtonLink>
            </div>

            <div className="rounded-[var(--radius)] border border-line p-6">
              <h2 className="font-display text-lg font-bold text-ink">Fares</h2>
              <dl className="mt-4 divide-y divide-line text-sm">
                {(
                  [
                    ["Adult (18+)", route.fares.adult],
                    ["Senior (65+)", route.fares.senior],
                    ["Youth (6–17)", route.fares.youth],
                    ["Child (under 6)", route.fares.child],
                  ] as const
                ).map(([label, price]) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <dt className="text-ink-muted">{label}</dt>
                    <dd className="font-semibold text-ink tabular">{formatCad(price)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
                {route.tripType === "round-trip"
                  ? "Round trip — your return is included and open-ended."
                  : "One way. Book two legs in the same transaction for a return."}{" "}
                A Parks Canada park pass is required separately.
              </p>
            </div>

            {route.versus.length > 0 && (
              <div className="rounded-[var(--radius)] border border-line p-6">
                <h2 className="font-display text-lg font-bold text-ink">
                  Compared with
                </h2>
                <dl className="mt-4 space-y-4 text-sm">
                  {route.versus.map((v) => (
                    <div key={v.operator}>
                      <dt className="font-semibold text-ink">{v.operator}</dt>
                      <dd className="mt-1 leading-relaxed text-ink-muted">{v.note}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-ink-subtle">
                  Verified {site.benchmarks.checkedOn}. We are not affiliated with any
                  operator named here.
                </p>
              </div>
            )}
          </aside>
        </div>
      </Section>

      {relevantFaqs.length > 0 && (
        <Section tone="sunken" className="py-14 md:py-20">
          <SectionHeading
            eyebrow={`Route ${route.number}`}
            title="Common questions"
            align="left"
          />
          <FaqAccordion items={relevantFaqs} className="mt-8 max-w-3xl" />
        </Section>
      )}

      <Section className="py-14 md:py-20">
        <SectionHeading eyebrow="Also serving" title="Other routes" align="left" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((r) => (
            <li key={r.id}>
              <Link
                href={`/routes/${r.slug}`}
                className="flex h-full flex-col rounded-[var(--radius)] border border-line p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
              >
                <span className="grid size-8 place-items-center rounded-md bg-brand-800 text-sm font-bold text-white tabular">
                  {r.number}
                </span>
                <span className="mt-3 font-sans text-[0.9375rem] font-bold text-ink">
                  {r.name}
                </span>
                <span className="mt-1 text-xs text-ink-muted">
                  {headwayLabel(r)} · from {formatCad(r.fares.adult)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
