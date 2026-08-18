import { Hero, routes, getDepartures, stopById } from "shuttlecompany";

/**
 * The home page hero: positioning copy, the booking search and the live
 * departure board, all above the fold.
 *
 * The search is the first interactive element on the page by design — the
 * tour-operator pattern of pushing booking two screens down is the single
 * biggest conversion leak on the competitor sites this was benchmarked against.
 *
 * It takes the same board data as `DepartureBoard`.
 */
const DATE = "2026-08-12";
const NOW = 9 * 60 + 25;

const rows = routes
  .flatMap((route) =>
    getDepartures(route, DATE)
      .filter((d) => d.minutes >= NOW - 5)
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

const filters = [
  { id: "moraine-lake", label: "Moraine Lake" },
  { id: "ll-lakeshore", label: "Lake Louise" },
  { id: "ll-village", label: "Village & Banff" },
  { id: "all", label: "Everything" },
];

export function HomePage() {
  return (
    <Hero
      rows={rows}
      dateISO={DATE}
      dateLabel="Wed, Aug 12"
      filters={filters}
      serverNowMinutes={NOW}
    />
  );
}

/** Late in the day, with only a few departures left to show. */
export function LateInTheDay() {
  return (
    <Hero
      rows={rows.slice(-3)}
      dateISO={DATE}
      dateLabel="Wed, Aug 12"
      filters={filters}
      serverNowMinutes={18 * 60 + 40}
    />
  );
}
