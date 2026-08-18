import {
  HeroPlanner,
  HeroBackdrop,
  DepartureBoard,
  routes,
  getDepartures,
  stopById,
} from "shuttlecompany";

/**
 * The hero's right-hand column: the headline promise plus whatever board is
 * passed in as `board`.
 *
 * `board` is a ReactNode rather than data because it is the only part that
 * needs server-rendered departures — everything else is static copy driven by
 * `fare`, `headway` and `guaranteeMinutes`.
 *
 * IMPORTANT: this renders white type and only reads on a dark ground. Always
 * mount it inside the hero shell below — `on-dark` plus `bg-brand-900` and the
 * backdrop — or the headline renders white-on-white and disappears.
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

const board = (
  <DepartureBoard
    rows={rows}
    dateISO={DATE}
    dateLabel="Wed, Aug 12"
    serverNowMinutes={NOW}
  />
);

/** The hero shell the planner is designed to sit in — copied from the home page. */
function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-brand-900">
      <HeroBackdrop />
      <div className="absolute inset-0 scrim-photo" aria-hidden />
      <div className="container-page relative pb-10 pt-8">{children}</div>
    </section>
  );
}

export function Default() {
  return (
    <HeroShell>
      <HeroPlanner board={board} fare="$29" headway={20} guaranteeMinutes={30} />
    </HeroShell>
  );
}

/** A longer-headway route, with the seat guarantee widened to match. */
export function LongerHeadway() {
  return (
    <HeroShell>
      <HeroPlanner board={board} fare="$19" headway={60} guaranteeMinutes={60} />
    </HeroShell>
  );
}
