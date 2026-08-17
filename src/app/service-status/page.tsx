import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/ui/section";
import { StatusPill } from "@/components/ui/status-pill";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { routes, headwayLabel, serviceWindowLabel } from "@/data/network";
import { site } from "@/config/site";
import { todayISO, formatDateLong } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Live Service Status — All Routes",
  description:
    "Current status of every route, plus advisories for road closures, wildlife delays and construction. Updated continuously through the operating day.",
  alternates: { canonical: "/service-status" },
};

export const revalidate = 300;

/**
 * Service status.
 *
 * The page that makes an operator look like a transit authority rather than a
 * booking form. It is also the page anxious visitors check the night before,
 * which makes it a surprisingly high-traffic surface — and one that earns
 * repeat visits and direct-navigation traffic, both of which are strong
 * quality signals.
 */

const advisories = [
  {
    id: "hwy1-construction",
    status: "delay" as const,
    title: "Highway 1 construction near Dead Man's Flats",
    routes: ["5"],
    body: "Single-lane alternating traffic is adding up to 10 minutes to eastbound afternoon services on Route 5. Westbound is unaffected. Expected to clear in late September.",
    posted: "2026-08-11",
  },
  {
    id: "wildlife-corridor",
    status: "info" as const,
    title: "Wildlife corridor speed restrictions after dusk",
    routes: ["4", "5"],
    body: "Reduced speed limits are in force on the Bow Valley Parkway between dusk and dawn. Late-evening services may run a few minutes behind. This is a Parks Canada requirement and we will not be requesting an exemption.",
    posted: "2026-06-01",
  },
];

export default function ServiceStatusPage() {
  const today = todayISO();
  const allNormal = routes.every((r) => r.status === "ontime");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Service status", path: "/service-status" },
        ])}
      />

      <PageHeader
        eyebrow="Network"
        title="Live service status"
        lede={`Every route, updated through the operating day. Last checked ${formatDateLong(today)}.`}
        breadcrumbs={[{ name: "Service status", path: "/service-status" }]}
      />

      <Section className="py-12 md:py-16">
        <div
          className={`rounded-[calc(var(--radius)+0.2rem)] border p-6 ${
            allNormal
              ? "border-ontime/25 bg-ontime-bg"
              : "border-delay/25 bg-delay-bg"
          }`}
        >
          <h2
            className={`font-display text-2xl font-bold ${
              allNormal ? "text-ontime-ink" : "text-delay-ink"
            }`}
          >
            {allNormal
              ? "All routes running normally"
              : "Some routes are running with delays"}
          </h2>
          <p
            className={`mt-2 leading-relaxed ${
              allNormal ? "text-ontime-ink" : "text-delay-ink"
            }`}
          >
            {allNormal
              ? "No cancellations or significant delays across the network. Advisories below are informational."
              : "Details by route below. Affected passengers are notified by text before their departure."}
          </p>
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold text-ink">By route</h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {routes.map((route) => (
            <li key={route.id} className="flex flex-wrap items-center gap-4 py-4">
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-[var(--radius)] bg-brand-800 font-display text-base font-bold text-white tabular"
              >
                {route.number}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/routes/${route.slug}`}
                  className="font-sans text-[1.0625rem] font-bold text-ink hover:text-brand-700 hover:underline"
                >
                  {route.name}
                </Link>
                <p className="mt-0.5 text-sm text-ink-muted">
                  {headwayLabel(route)} · {serviceWindowLabel(route)}
                </p>
                {route.statusNote && (
                  <p className="mt-1.5 text-sm text-delay-ink">{route.statusNote}</p>
                )}
              </div>
              <StatusPill status={route.status} />
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-display text-2xl font-bold text-ink">
          Current advisories
        </h2>
        <ul className="mt-6 space-y-4">
          {advisories.map((advisory) => (
            <li
              key={advisory.id}
              className="rounded-[var(--radius)] border border-line p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-sans text-[1.0625rem] font-bold text-ink">
                  {advisory.title}
                </h3>
                <StatusPill status={advisory.status} />
              </div>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {advisory.body}
              </p>
              <p className="mt-3 text-xs text-ink-subtle">
                Affects route{advisory.routes.length > 1 ? "s" : ""}{" "}
                {advisory.routes.join(", ")} · Posted {advisory.posted}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 rounded-[var(--radius)] border border-info/20 bg-info-bg px-5 py-4 text-sm leading-relaxed text-info-ink">
          <strong className="font-semibold">Something wrong right now?</strong> Call{" "}
          <a href={`tel:${site.contact.tollFree}`} className="font-semibold underline underline-offset-2">
            {site.contact.tollFreeDisplay}
          </a>
          . Dispatch is staffed from 3:00 am to 10:00 pm Mountain during the operating
          season and a person answers.
        </p>
      </Section>
    </>
  );
}
