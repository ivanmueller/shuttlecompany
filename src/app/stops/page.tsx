import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/ui/section";
import { StatusPill } from "@/components/ui/status-pill";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { stops, routes } from "@/data/network";

export const metadata: Metadata = {
  title: "Stops & Parking — Where to Board Your Shuttle",
  description:
    "Exact boarding locations and parking for every stop: Lake Louise Village, the Gondola Park & Ride, Moraine Lake, the lakeshore, Banff and Canmore. Free reserved parking included with your fare.",
  alternates: { canonical: "/stops" },
};

const parkingTone = {
  "free-guaranteed": { status: "ontime" as const, label: "Free reserved parking" },
  "free-limited": { status: "delay" as const, label: "Free, limited spaces" },
  paid: { status: "delay" as const, label: "Paid parking" },
  none: { status: "issue" as const, label: "No parking" },
};

export default function StopsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Stops & parking", path: "/stops" },
        ])}
      />

      <PageHeader
        eyebrow="Finding us"
        title="Stops & parking"
        lede="Missing a bus almost always comes down to standing in the wrong place, not leaving too late. Here is exactly where each stop is and what the parking situation actually is."
        breadcrumbs={[{ name: "Stops & parking", path: "/stops" }]}
      />

      <Section className="py-12 md:py-16">
        <ul className="space-y-5">
          {stops.map((stop) => {
            const serving = routes.filter((r) => r.stopIds.includes(stop.id));
            const tone = parkingTone[stop.parking];
            return (
              <li
                key={stop.id}
                className="rounded-[calc(var(--radius)+0.2rem)] border border-line p-5 md:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-bold text-ink">{stop.name}</h2>
                    <p className="mt-0.5 text-sm text-ink-subtle">{stop.locality}</p>
                  </div>
                  <StatusPill status={tone.status} label={tone.label} />
                </div>

                <dl className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
                      Where to board
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                      {stop.boarding}
                    </dd>
                  </div>
                  {stop.parkingNote && (
                    <div>
                      <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
                        Parking
                      </dt>
                      <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                        {stop.parkingNote}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-subtle">
                    Routes
                  </span>
                  {serving.map((route) => (
                    <Link
                      key={route.id}
                      href={`/routes/${route.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-ink-muted transition-colors hover:border-brand-400 hover:text-brand-700"
                    >
                      <span
                        aria-hidden
                        className="grid size-4 place-items-center rounded bg-brand-800 text-[0.5625rem] font-bold text-white tabular"
                      >
                        {route.number}
                      </span>
                      {route.shortName}
                    </Link>
                  ))}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${stop.coords.lat},${stop.coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs font-semibold text-brand-700 underline-offset-4 hover:underline"
                  >
                    Open in Maps ↗
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 rounded-[var(--radius)] border border-info/20 bg-info-bg px-5 py-4 text-sm leading-relaxed text-info-ink">
          <strong className="font-semibold">Arrive 15 minutes early.</strong> On peak days
          the walk from the far end of the Park &amp; Ride to the boarding bays takes close
          to 10 minutes. Our buses leave on time — waiting for late passengers would make
          every subsequent departure late too.
        </p>
      </Section>
    </>
  );
}
