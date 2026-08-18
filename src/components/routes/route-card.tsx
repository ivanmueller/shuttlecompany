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
import { cn, formatCad } from "@/lib/utils";
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
              <span className="ml-2 rounded-full bg-accent-400 px-2 py-0.5 text-[0.625rem] font-bold text-ink">
                Most booked
              </span>
            )}
          </p>
          <h3 className="mt-1 truncate font-sans text-[1.0625rem] font-bold leading-tight text-ink">
            <Link href={`/routes/${route.slug}`} className="inline-block py-0.5 hover:text-brand-700">
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
              {/* "Book Route 4" names our internal identifier. This names
                  what the visitor gets, and carries the fare advantage into
                  the label itself. */}
              Book — {formatCad(route.fares.adult)}
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

/**
 * Flagship route card.
 *
 * Five routes rendered as equals, ordered by route number, with two buttons
 * each — ten near-identical calls to action in one section. Route 1 to
 * Moraine Lake is almost certainly the overwhelming majority of demand and
 * the reason anyone found this site; it had the same visual weight as the
 * Canmore hourly.
 *
 * The diagnosis matters for the fix. This is not really choice overload —
 * Scheibehenne and colleagues' 2010 meta-analysis found that effect is close
 * to zero on average, and it shows up mainly when people have no prior
 * preference. This visitor has one. It is a *defaults* problem: the page made
 * them work to find the thing they already came for.
 */
export function FlagshipRouteCard({
  route,
  className,
}: {
  route: Route;
  className?: string;
}) {
  const origin = stopById(route.originId);
  const destination = stopById(route.destinationId);
  const anchor = site.benchmarks.moraineLakeBusDaytime;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[calc(var(--radius)+0.2rem)] border-2 border-brand-800 bg-paper shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="p-6 md:p-7">
          <p className="flex flex-wrap items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
            Route {route.number}
            <span className="rounded-full bg-accent-400 px-2 py-0.5 text-[0.625rem] font-bold text-ink">
              Most booked
            </span>
            <StatusPill status={route.status} size="sm" />
          </p>
          <h3 className="mt-2 font-sans text-2xl font-bold leading-tight text-ink">
            <Link href={`/routes/${route.slug}`} className="inline-block py-0.5 hover:text-brand-700">
              {route.name}
            </Link>
          </h3>
          <p className="mt-3 font-display text-[1.75rem] font-bold leading-none text-brand-800">
            {headwayLabel(route)}
          </p>
          <p className="mt-2 text-[0.9375rem] text-ink-muted tabular">
            {dailyDepartureCount(route)} departures daily · {serviceWindowLabel(route)} ·{" "}
            {origin.shortName} to {destination.shortName} in {route.durationMinutes} min
          </p>
          <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ink-muted">
            {route.summary}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 border-t border-line bg-sunken p-6 md:border-l md:border-t-0 md:p-7">
          <div>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[2.25rem] font-bold leading-none text-ink">
                {formatCad(route.fares.adult)}
              </span>
              {/* Attributed, not a strikethrough. A struck-through competitor
                  price reads as our own former price, which is an ordinary-
                  selling-price claim we cannot substantiate. */}
              <span className="text-sm text-ink-subtle">round trip</span>
            </p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-muted">
              Moraine Lake Bus Company charges {formatCad(anchor)} for the same run.
              Under 6 travel free — two adults and two small children is{" "}
              {formatCad(route.fares.adult * 2)}.
            </p>
          </div>
          <div className="grid gap-2">
            <ButtonLink href={`/book?route=${route.slug}`} size="lg">
              See today&apos;s departures
            </ButtonLink>
            <ButtonLink href={`/routes/${route.slug}`} variant="outline" size="md">
              Full timetable
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
