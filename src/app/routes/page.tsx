import type { Metadata } from "next";
import { RouteCard } from "@/components/routes/route-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { routeListSchema, breadcrumbSchema } from "@/lib/schema";
import { routes, totalDailyDepartures, stops } from "@/data/network";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Routes & Schedules — Every Departure to Moraine Lake & Lake Louise",
  description: `All ${routes.length} routes with full timetables: Moraine Lake every 20 minutes, Lake Louise lakeshore every 15, Banff every 30. ${totalDailyDepartures()} departures a day, ${site.season.label}.`,
  alternates: { canonical: "/routes" },
};

export default function RoutesPage() {
  return (
    <>
      <JsonLd data={routeListSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Routes & schedules", path: "/routes" },
        ])}
      />

      <PageHeader
        eyebrow="The network"
        title="Routes & schedules"
        lede={`${routes.length} routes, ${totalDailyDepartures()} departures every day, serving ${stops.length} stops between Canmore and Moraine Lake. Full timetables below — no reservation window, no waiting list.`}
        breadcrumbs={[{ name: "Routes & schedules", path: "/routes" }]}
      />

      <Section className="pt-12 md:pt-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </Section>

      <Section tone="sunken" className="py-14 md:py-20">
        <SectionHeading
          eyebrow="Connections"
          title="How the routes fit together"
          lede="Lake Louise Village is the hub. Every route touches it, so any two trips connect without leaving the transit bay."
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {[
            {
              from: "Arriving from Banff or Canmore",
              body: "Take Route 4 or Route 5 to Lake Louise Village, then step across to Route 1 for Moraine Lake or Route 3 for the lakeshore. Connections are timed with a 10-minute buffer.",
            },
            {
              from: "Driving yourself to the area",
              body: "Park free at the Gondola Park & Ride and board Route 1 or Route 3 there directly. Do not drive to the lakeshore or Moraine Lake Road — the first lot fills by 07:00 and the second is closed to cars entirely.",
            },
            {
              from: "Doing both lakes in a day",
              body: "Route 1 out to Moraine Lake first thing, back to the village, then Route 3 to the lakeshore in the afternoon. Two separate tickets, both open-return, roughly $41 per adult.",
            },
          ].map((item) => (
            <div
              key={item.from}
              className="rounded-[var(--radius)] border border-line bg-paper p-5"
            >
              <h3 className="font-sans text-[1.0625rem] font-bold text-ink">{item.from}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/book" size="lg">
            Find your departure
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
