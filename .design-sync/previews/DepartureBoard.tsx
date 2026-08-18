import { DepartureBoard, routes, getDepartures, stopById } from "shuttlecompany";

/**
 * The live departure board — the cheapest possible proof of the whole value
 * proposition. A visitor just told "every 20 minutes" can see the next real
 * departures and stop reading the marketing copy.
 *
 * Sold-out departures stay visible rather than being filtered out: seeing that
 * 9:00 and 9:20 are gone is what makes 9:40 feel urgent.
 *
 * Build `rows` the way the home page does — flatten `getDepartures` across
 * routes and sort by minute. `serverNowMinutes` is park time at render, so the
 * first paint is roughly right before the client refines against its own clock.
 */
const DATE = "2026-08-12";
const DATE_LABEL = "Wed, Aug 12";
const NOW = 9 * 60 + 25; // 9:25 am park time

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

export function WithFilters() {
  return (
    <DepartureBoard
      rows={rows}
      dateISO={DATE}
      dateLabel={DATE_LABEL}
      filters={filters}
      serverNowMinutes={NOW}
    />
  );
}

/** Filters are optional — without them the board is a plain chronological list. */
export function Unfiltered() {
  return (
    <DepartureBoard
      rows={rows.slice(0, 8)}
      dateISO={DATE}
      dateLabel={DATE_LABEL}
      serverNowMinutes={NOW}
    />
  );
}

/** End of service: the board says so plainly rather than rendering an empty table. */
export function NothingLeftToday() {
  return (
    <DepartureBoard
      rows={[]}
      dateISO={DATE}
      dateLabel={DATE_LABEL}
      filters={filters}
      serverNowMinutes={23 * 60}
    />
  );
}
