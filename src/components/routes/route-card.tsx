import Link from "next/link";
import {
  type Route,
  stopById,
  dailyDepartureCount,
  headwayLabel,
  serviceWindowLabel,
} from "@/data/network";
import { ButtonLink } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { formatCad } from "@/lib/utils";
import { site } from "@/config/site";

/**
 * Route card.
 *
 * Every competitor sells these as "tours" with a hero photo and a price.
 * We sell them as transit: route number, headway, service window, fare. That
 * framing is the product differentiator and it also happens to convert better
 * for the intent we are targeting — someone who has already decided to go and
 * now needs a seat.
 *
 * The frequency line carries the most weight, so it gets the most ink.
 */
export function RouteCard({ route }: { route: Route }) {
  const origin = stopById(route.originId);
  const destination = stopById(route.destinationId);
  const departures = dailyDepartureCount(route);

  /* Honest anchor: only shown where a real competitor sells the same trip. */
  const anchor =
    route.slug === "moraine-lake-express"
      ? site.benchmarks.moraineLakeBusDaytime
      : route.slug === "moraine-lake-sunrise"
        ? site.benchmarks.moraineLakeBusSunrise
        : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[calc(var(--radius)+0.2rem)] border border-line bg-paper shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-lift)]">
      <header className="flex items-start gap-3 border-b border-line bg-sunken px-5 py-4">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-[var(--radius)] bg-brand-800 font-display text-lg font-bold text-white tabular"
          aria-hidden
        >
          {route.number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
            Route {route.number}
            {route.popular && (
              <span className="ml-2 rounded-full bg-accent-500/20 px-2 py-0.5 text-[0.625rem] text-accent-700">
                Most booked
              </span>
            )}
          </p>
          <h3 className="mt-1 truncate font-sans text-[1.0625rem] font-bold leading-tight text-ink">
            <Link href={`/routes/${route.slug}`} className="hover:text-brand-700">
              {route.name}
            </Link>
          </h3>
        </div>
      </header>

      <div className="flex flex-1 flex-col p-5">
        {/* Frequency is the headline claim, so it is typeset like one. */}
        <p className="font-display text-[1.375rem] font-bold leading-none text-brand-800">
          {headwayLabel(route)}
        </p>
        <p className="mt-1.5 text-[0.8125rem] text-ink-muted tabular">
          {departures} departures daily · {serviceWindowLabel(route)}
        </p>

        <ol className="mt-4 space-y-2.5 border-l border-dashed border-line-strong pl-4 text-sm">
          <li className="relative">
            <span
              aria-hidden
              className="absolute -left-[1.3125rem] top-1.5 size-2 rounded-full border-2 border-brand-700 bg-paper"
            />
            <span className="font-medium text-ink">{origin.shortName}</span>
          </li>
          {route.stopIds.length > 2 && (
            <li className="relative text-xs text-ink-subtle">
              <span aria-hidden className="absolute -left-[1.1875rem] top-1.5 size-1 rounded-full bg-line-strong" />
              {route.stopIds.length - 2} stop
              {route.stopIds.length - 2 === 1 ? "" : "s"} between
            </li>
          )}
          <li className="relative">
            <span
              aria-hidden
              className="absolute -left-[1.3125rem] top-1.5 size-2 rounded-full bg-brand-700"
            />
            <span className="font-medium text-ink">{destination.shortName}</span>
            <span className="ml-1.5 text-ink-subtle tabular">
              · {route.durationMinutes} min
            </span>
          </li>
        </ol>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="flex items-baseline gap-2">
                <span className="font-display text-[1.75rem] font-bold leading-none text-ink">
                  {formatCad(route.fares.adult)}
                </span>
                {anchor && (
                  <span className="text-sm text-ink-subtle line-through tabular">
                    {formatCad(anchor)}
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                per adult,{" "}
                {route.tripType === "round-trip" ? "round trip" : "one way"}
              </p>
            </div>
            <StatusPill status={route.status} size="sm" />
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <ButtonLink
              href={`/book?route=${route.slug}`}
              size="md"
            >
              Book Route {route.number}
            </ButtonLink>
            <ButtonLink
              href={`/routes/${route.slug}`}
              variant="outline"
              size="md"
            >
              Timetable
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
