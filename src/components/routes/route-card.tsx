import Link from "next/link";
import {
  type Route,
  stopById,
  planJourneys,
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
 * Every competitor sells these as "tours" with a hero photo and a price. We
 * sell them as transit: journey, frequency, service window, fare. That framing
 * is the product differentiator and it converts better for the intent we are
 * targeting — someone who has already decided to go and now needs a seat.
 *
 * What these cards used to lead with was the *operator's* name for the
 * product: "Route 4 — Banff — Lake Louise Connector". That asks a first-time
 * visitor to hold a network diagram in their head and derive that Banff to
 * Moraine Lake means Route 4 and then Route 1 — a derivation nothing on the
 * page offered to do for them. It also did not fit: three of the five names
 * were clipped mid-word on a 390px phone.
 *
 * So the headline is now the journey, in the visitor's own terms, and the
 * route number is filed underneath as the reference it is. Where a card does
 * not reach Moraine Lake directly, the onward connection is computed and
 * stated on the card rather than left as an exercise.
 */

/** The onward leg to the lake, for any route that stops short of it. */
function onwardToMoraine(route: Route) {
  if (route.destinationId === "moraine-lake") return null;
  const journey = planJourneys(route.originId, "moraine-lake")[0];
  if (!journey || journey.legs.length < 2) return null;
  return journey;
}

export function RouteCard({ route }: { route: Route }) {
  const origin = stopById(route.originId);
  const destination = stopById(route.destinationId);
  const departures = dailyDepartureCount(route);
  const onward = onwardToMoraine(route);

  /* Honest anchor: only where a real competitor sells the same trip. */
  const anchor =
    route.slug === "moraine-lake-sunrise"
      ? site.benchmarks.moraineLakeBusSunrise
      : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[calc(var(--radius)+0.2rem)] border border-line bg-paper shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-lift)]">
      <header className="border-b border-line bg-sunken px-5 py-4">
        {/* The journey, which is what the visitor is shopping for. */}
        <h3 className="font-sans text-[1.0625rem] font-bold leading-snug text-ink">
          <Link
            href={`/routes/${route.slug}`}
            className="inline-block py-0.5 hover:text-brand-700"
          >
            {origin.shortName}{" "}
            <span aria-hidden className="text-brand-700">
              →
            </span>
            <span className="sr-only">to</span> {destination.shortName}
          </Link>
        </h3>
        {/* The route number, filed where a reference belongs. */}
        <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
          Route {route.number} · {route.name}
          {route.popular && (
            <span className="rounded-full bg-accent-400 px-2 py-0.5 text-[0.625rem] font-bold text-ink">
              Most booked
            </span>
          )}
        </p>
      </header>

      <div className="flex flex-1 flex-col p-5">
        {/* Frequency is the headline claim, so it is typeset like one. */}
        <p className="font-display text-[1.375rem] font-bold leading-none text-brand-800">
          {headwayLabel(route)}
        </p>
        <p className="mt-1.5 text-[0.8125rem] text-ink-muted tabular">
          {route.durationMinutes} min · {departures} departures daily ·{" "}
          {serviceWindowLabel(route)}
        </p>

        {route.stopIds.length > 2 && (
          <p className="mt-2 text-[0.8125rem] text-ink-subtle">
            {route.stopIds.length - 2} stop
            {route.stopIds.length - 2 === 1 ? "" : "s"} between
          </p>
        )}

        {/* The derivation the visitor should not have to do themselves. */}
        {onward && (
          <p className="mt-4 rounded-[var(--radius)] border border-line bg-sunken px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">
              Going to Moraine Lake?
            </span>{" "}
            Change at {stopById(onward.viaStopId ?? "").shortName} for Route{" "}
            {onward.legs[1].route.number} — about {onward.totalMinutes} min in
            total, {formatCad(onward.adultFare)} per adult, both legs booked
            together.
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-[1.75rem] font-bold leading-none text-ink">
                {formatCad(route.fares.adult)}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                per adult,{" "}
                {route.tripType === "round-trip" ? "round trip" : "one way"}
              </p>
              {/* Attributed, never struck through. A struck-through
                  competitor price reads as our own former price — an
                  ordinary-selling-price claim we cannot substantiate. */}
              {anchor && (
                <p className="mt-1.5 text-xs leading-relaxed text-ink-subtle">
                  Moraine Lake Bus Co. charges {formatCad(anchor)}.
                </p>
              )}
            </div>
            <StatusPill status={route.status} size="sm" />
          </div>

          {/* One action. "Timetable" used to be a second button of equal
              weight sitting beside the purchase — five extra exits placed
              next to five buy buttons — and is a text link now. */}
          <ButtonLink
            href={`/book?route=${route.slug}`}
            size="md"
            className="mt-4 w-full"
          >
            Book — {formatCad(route.fares.adult)}
          </ButtonLink>
          <Link
            href={`/routes/${route.slug}`}
            className="mt-3 inline-block py-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Full timetable →
          </Link>
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
          <h3 className="font-sans text-2xl font-bold leading-tight text-ink">
            <Link
              href={`/routes/${route.slug}`}
              className="inline-block py-0.5 hover:text-brand-700"
            >
              {origin.shortName}{" "}
              <span aria-hidden className="text-brand-700">
                →
              </span>
              <span className="sr-only">to</span> {destination.shortName}
            </Link>
          </h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
            Route {route.number} · {route.name}
            <span className="rounded-full bg-accent-400 px-2 py-0.5 text-[0.625rem] font-bold text-ink">
              Most booked
            </span>
            <StatusPill status={route.status} size="sm" />
          </p>
          <p className="mt-4 font-display text-[1.75rem] font-bold leading-none text-brand-800">
            {headwayLabel(route)}
          </p>
          <p className="mt-2 text-[0.9375rem] text-ink-muted tabular">
            {route.durationMinutes} min · {dailyDepartureCount(route)} departures
            daily · {serviceWindowLabel(route)}
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
          <div>
            <ButtonLink href={`/book?route=${route.slug}`} size="lg" className="w-full">
              Book — {formatCad(route.fares.adult)}
            </ButtonLink>
            <Link
              href={`/routes/${route.slug}`}
              className="mt-3 inline-block py-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Full timetable →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
