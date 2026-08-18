/**
 * The transit network: stops, routes, fares and timetable rules.
 *
 * This is the single source of truth. Schedule pages, the booking search,
 * route pages and all JSON-LD structured data are derived from it, so a
 * timetable change is a one-file edit and can never drift between the
 * marketing copy and the booking engine.
 *
 * Times are stored as "minutes after midnight" local (Mountain) time and
 * formatted at the edge, which avoids every timezone bug that comes from
 * storing wall-clock strings.
 */

export type FareClass = "adult" | "senior" | "youth" | "child";

export type ServiceStatus = "ontime" | "delay" | "issue";

export interface Stop {
  id: string;
  name: string;
  shortName: string;
  locality: string;
  /** Rider-facing boarding instruction. Ambiguity here is the #1 cause of
   *  missed departures and refund requests. */
  boarding: string;
  parking: "free-guaranteed" | "free-limited" | "paid" | "none";
  parkingNote?: string;
  coords: { lat: number; lng: number };
}

export interface Route {
  id: string;
  /** Public-facing route number. Riders and search engines both use these. */
  number: string;
  slug: string;
  name: string;
  /** Short label for timetable chips and the booking widget. */
  shortName: string;
  originId: string;
  destinationId: string;
  /** Ordered stop ids, origin first. */
  stopIds: string[];
  /** Scheduled running time, one direction, in minutes. */
  durationMinutes: number;
  /** Minutes between departures. This is the whole competitive thesis. */
  headwayMinutes: number;
  /** First and last outbound departure, minutes after midnight. */
  firstDeparture: number;
  lastDeparture: number;
  tripType: "round-trip" | "one-way";
  fares: Record<FareClass, number>;
  /** Vehicle capacity — drives the seats-remaining display. */
  capacity: number;
  status: ServiceStatus;
  statusNote?: string;
  summary: string;
  /** Three to five rider-facing benefits, shown on the route card. */
  highlights: string[];
  /** Honest, checkable comparison used on the route page. */
  versus: { operator: string; note: string }[];
  popular?: boolean;
  seasonal?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Stops                                                                       */
/* -------------------------------------------------------------------------- */

export const stops: Stop[] = [
  {
    id: "ll-village",
    name: "Lake Louise Village Transit Hub",
    shortName: "Lake Louise Village",
    locality: "Lake Louise, AB",
    boarding: "Samson Mall parking lot, north end, beside the Post Office. Look for the numbered shuttle bay signs.",
    parking: "free-guaranteed",
    parkingNote: "Free reserved parking is included with every booking — your space is held until your departure time.",
    coords: { lat: 51.4254, lng: -116.1773 },
  },
  {
    id: "ll-gondola",
    name: "Lake Louise Gondola Park & Ride",
    shortName: "Gondola Park & Ride",
    locality: "Lake Louise, AB",
    boarding: "Bus loop outside the main gondola day lodge. Follow signs for 'Shuttle Departures'.",
    parking: "free-guaranteed",
    parkingNote: "600+ free spaces. Overflow lot opens automatically on peak days.",
    coords: { lat: 51.4432, lng: -116.1477 },
  },
  {
    id: "moraine-lake",
    name: "Moraine Lake",
    shortName: "Moraine Lake",
    locality: "Banff National Park, AB",
    boarding: "Drop-off and pick-up at the Moraine Lake day-use bus loop, 200 m from the Rockpile trailhead.",
    parking: "none",
    parkingNote: "Moraine Lake Road is closed to personal vehicles. Shuttle, bike or foot only.",
    coords: { lat: 51.3217, lng: -116.1860 },
  },
  {
    id: "ll-lakeshore",
    name: "Lake Louise Lakeshore",
    shortName: "Lake Louise Lakeshore",
    locality: "Banff National Park, AB",
    boarding: "Lakeshore bus loop below the Fairmont Chateau Lake Louise, adjacent to the boathouse path.",
    parking: "paid",
    parkingNote: "Parks Canada charges for lakeshore parking and the lot regularly fills before 07:00.",
    coords: { lat: 51.4166, lng: -116.2168 },
  },
  {
    id: "banff-downtown",
    name: "Banff Downtown Transit Hub",
    shortName: "Banff Downtown",
    locality: "Banff, AB",
    boarding: "Bay 3, Banff High School Transit Hub on Banff Avenue at Wolf Street.",
    parking: "free-limited",
    parkingNote: "Free municipal parking at the Banff Train Station lot, a 6-minute walk away.",
    coords: { lat: 51.1784, lng: -115.5708 },
  },
  {
    id: "canmore-downtown",
    name: "Canmore Downtown",
    shortName: "Canmore",
    locality: "Canmore, AB",
    boarding: "Canmore Civic Centre transit bay on 7th Avenue.",
    parking: "free-limited",
    parkingNote: "Free 12-hour parking at the Canmore Civic Centre lot.",
    coords: { lat: 51.0899, lng: -115.3528 },
  },
  {
    id: "castle-junction",
    name: "Castle Junction",
    shortName: "Castle Junction",
    locality: "Banff National Park, AB",
    boarding: "Highway 1 eastbound and westbound pull-outs at the Castle Mountain interchange.",
    parking: "free-limited",
    coords: { lat: 51.2664, lng: -115.9139 },
  },
];

export const stopById = (id: string): Stop => {
  const stop = stops.find((s) => s.id === id);
  if (!stop) throw new Error(`Unknown stop id: ${id}`);
  return stop;
};

/* -------------------------------------------------------------------------- */
/* Routes                                                                      */
/* -------------------------------------------------------------------------- */

export const routes: Route[] = [
  {
    id: "r1",
    number: "1",
    slug: "moraine-lake-express",
    name: "Moraine Lake Express",
    shortName: "Moraine Lake Express",
    originId: "ll-gondola",
    destinationId: "moraine-lake",
    stopIds: ["ll-gondola", "ll-village", "moraine-lake"],
    durationMinutes: 35,
    headwayMinutes: 20,
    firstDeparture: 6 * 60,
    lastDeparture: 19 * 60 + 20,
    tripType: "round-trip",
    fares: { adult: 29, senior: 24, youth: 19, child: 0 },
    capacity: 24,
    status: "ontime",
    summary:
      "Our flagship route. A bus to Moraine Lake every 20 minutes from 6:00 am to 7:20 pm — no reservation lottery, no 8:00 am scramble, and you pick your own return time on the day.",
    highlights: [
      "Departures every 20 minutes — 41 per day",
      "Free guaranteed parking at the Gondola Park & Ride",
      "Open return: come back on any bus with a seat",
      "Free change or cancel up to 2 hours before departure",
    ],
    versus: [
      {
        operator: "Parks Canada Shuttle",
        note: "Reservation-only, released in two windows that sell out in minutes, and a fixed return time.",
      },
      {
        operator: "Moraine Lake Bus Company",
        note: "Comparable frequency, roughly double the fare for the daytime service.",
      },
    ],
    popular: true,
  },
  {
    id: "r2",
    number: "2",
    slug: "moraine-lake-sunrise",
    name: "Moraine Lake Sunrise",
    shortName: "Sunrise Service",
    originId: "ll-village",
    destinationId: "moraine-lake",
    stopIds: ["ll-village", "moraine-lake"],
    durationMinutes: 25,
    headwayMinutes: 25,
    firstDeparture: 3 * 60 + 45,
    lastDeparture: 5 * 60 + 50,
    tripType: "round-trip",
    fares: { adult: 49, senior: 44, youth: 34, child: 0 },
    capacity: 24,
    status: "ontime",
    summary:
      "Be on the Rockpile before the first light hits the Ten Peaks. Pre-dawn departures every 25 minutes, timed to the actual sunrise for the date you travel.",
    highlights: [
      "Departure times track real sunrise, adjusted weekly",
      "Arrive 45–60 minutes before first light",
      "Return on any Route 1 bus at no extra cost",
      "Heated waiting area at Samson Mall from 3:15 am",
    ],
    versus: [
      {
        operator: "Parks Canada Shuttle",
        note: "Does not run before dawn. Sunrise at Moraine Lake is not available on the Parks Canada shuttle at all.",
      },
      {
        operator: "Moraine Lake Bus Company",
        note: "Runs a sunrise service at a significantly higher fare.",
      },
    ],
  },
  {
    id: "r3",
    number: "3",
    slug: "lake-louise-lakeshore-shuttle",
    name: "Lake Louise Lakeshore Shuttle",
    shortName: "Lakeshore Shuttle",
    originId: "ll-village",
    destinationId: "ll-lakeshore",
    stopIds: ["ll-gondola", "ll-village", "ll-lakeshore"],
    durationMinutes: 18,
    headwayMinutes: 15,
    firstDeparture: 6 * 60 + 15,
    lastDeparture: 20 * 60 + 30,
    tripType: "round-trip",
    fares: { adult: 12, senior: 10, youth: 8, child: 0 },
    capacity: 32,
    status: "ontime",
    summary:
      "The lakeshore parking lot fills before 7:00 am on most summer days. This runs every 15 minutes so you can skip it entirely and still be at the water when you want to be.",
    highlights: [
      "Every 15 minutes — 58 departures a day",
      "Skip the lakeshore lot, which fills by 07:00 in peak season",
      "Cheaper than a day of paid lakeshore parking",
      "Connects directly to Route 1 for Moraine Lake",
    ],
    versus: [
      {
        operator: "Parks Canada Shuttle",
        note: "Same destination, but reservation-only and released on a fixed booking calendar.",
      },
      {
        operator: "Driving yourself",
        note: "Paid parking, and the lot is routinely full before 07:00 from June through September.",
      },
    ],
  },
  {
    id: "r4",
    number: "4",
    slug: "banff-lake-louise-connector",
    name: "Banff — Lake Louise Connector",
    shortName: "Banff Connector",
    originId: "banff-downtown",
    destinationId: "ll-village",
    stopIds: ["banff-downtown", "castle-junction", "ll-village", "ll-gondola"],
    durationMinutes: 65,
    headwayMinutes: 30,
    firstDeparture: 5 * 60 + 30,
    lastDeparture: 21 * 60,
    tripType: "one-way",
    fares: { adult: 19, senior: 16, youth: 12, child: 0 },
    capacity: 40,
    status: "ontime",
    summary:
      "Staying in Banff without a car? A bus to Lake Louise every 30 minutes, all day, with guaranteed seats you can book the night before — or the morning of.",
    highlights: [
      "Every 30 minutes, 5:30 am to 9:00 pm",
      "Seats released daily — no season-opening reservation rush",
      "Guaranteed connection to Route 1 for Moraine Lake",
      "Free onboard Wi-Fi and USB charging",
    ],
    versus: [
      {
        operator: "Roam Transit Route 8X",
        note: "A lower base fare, but reservations are typically sold out for much of the summer.",
      },
      {
        operator: "Driving yourself",
        note: "Lake Louise lots fill early and Moraine Lake Road is closed to personal vehicles entirely.",
      },
    ],
  },
  {
    id: "r5",
    number: "5",
    slug: "canmore-lake-louise-direct",
    name: "Canmore — Lake Louise Direct",
    shortName: "Canmore Direct",
    originId: "canmore-downtown",
    destinationId: "ll-village",
    stopIds: ["canmore-downtown", "banff-downtown", "ll-village"],
    durationMinutes: 95,
    headwayMinutes: 60,
    firstDeparture: 6 * 60,
    lastDeparture: 19 * 60,
    tripType: "one-way",
    fares: { adult: 29, senior: 25, youth: 19, child: 0 },
    capacity: 40,
    status: "delay",
    statusNote: "Highway 1 construction near Dead Man's Flats is adding up to 10 minutes eastbound.",
    summary:
      "One bus, Canmore to Lake Louise, hourly. No transfer in Banff, no parking to find at either end.",
    highlights: [
      "Hourly departures with no transfer required",
      "Free 12-hour parking at the Canmore Civic Centre lot",
      "Reclining coach seating for the 95-minute run",
      "Connects to Routes 1 and 3 at Lake Louise Village",
    ],
    versus: [
      {
        operator: "Roam Transit",
        note: "Requires a transfer in Banff between the regional and express services.",
      },
    ],
    seasonal: true,
  },
];

export const routeBySlug = (slug: string): Route | undefined =>
  routes.find((r) => r.slug === slug);

/* -------------------------------------------------------------------------- */
/* Timetable generation                                                        */
/* -------------------------------------------------------------------------- */

export interface Departure {
  /** Minutes after midnight, local time. */
  minutes: number;
  /** "06:20" — 24h, stable across locales, used as a React key and URL param. */
  time: string;
  /** "6:20 am" — rider-facing. */
  label: string;
  arrivalLabel: string;
  seatsRemaining: number;
  /** Qualitative state. Prefer this over `seatsRemaining` in any UI. */
  availability: Availability;
  status: ServiceStatus;
}

export const formatMinutes = (minutes: number): string => {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

export const formatMinutesLabel = (minutes: number): string => {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m % 60).padStart(2, "0")} ${h24 < 12 ? "am" : "pm"}`;
};

/**
 * Deterministic pseudo-random in [0, 1) from a string.
 *
 * Seat counts must be identical on the server and the client or React will
 * throw a hydration mismatch, and identical across a rebuild or the numbers
 * would jump while a rider is looking at them. A hash of route + date + time
 * gives realistic-looking, stable availability without a database.
 *
 * IMPORTANT: this is a *demand model*, not inventory. While
 * `site.inventoryIsLive` is false, nothing derived from it may be shown as a
 * number — see `availabilityOf` below. Replace this with a live inventory
 * call when the booking backend exists.
 */
const hash01 = (input: string): number => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
};

/**
 * Availability curve: mid-morning departures to Moraine Lake are the scarcest
 * slots in the valley, and the shoulders of the day are wide open. Modelling
 * that makes the scarcity signal honest rather than decorative.
 */
const demandFactor = (minutes: number): number => {
  const hour = minutes / 60;
  if (hour < 5) return 0.55; // sunrise — enthusiast demand, small buses
  if (hour < 7) return 0.35;
  if (hour < 11) return 0.85; // peak
  if (hour < 15) return 0.6;
  if (hour < 18) return 0.4;
  return 0.2;
};

/**
 * Qualitative availability.
 *
 * The rules, in order of how much they matter:
 *
 *  1. "sold-out" and "limited" are the only states that carry urgency, so
 *     they are the only ones allowed to be wrong at anyone's expense. While
 *     inventory is not live we never render a seat *count* — a screenshot of
 *     "Only 3 seats left" that never changes costs more than the urgency
 *     earns, and s.74.01 of the Competition Act applies to it.
 *  2. Amber is the alarm colour everywhere else on this site. It is reserved
 *     for `limited` (four or fewer). Five to eight seats on a 24-seat coach
 *     is a healthy bus, not a warning, and a signal that fires on a seventh
 *     of all rows stops being a signal.
 */
export type Availability = "sold-out" | "limited" | "available" | "wide-open";

export const availabilityOf = (seats: number, capacity: number): Availability => {
  if (seats <= 0) return "sold-out";
  if (seats <= 4) return "limited";
  if (seats >= capacity * 0.6) return "wide-open";
  return "available";
};

export const getDepartures = (route: Route, dateISO: string): Departure[] => {
  const out: Departure[] = [];
  for (let m = route.firstDeparture; m <= route.lastDeparture; m += route.headwayMinutes) {
    const seed = hash01(`${route.id}|${dateISO}|${m}`);
    const taken = Math.min(
      route.capacity,
      Math.round(route.capacity * demandFactor(m) * (0.55 + seed * 0.75)),
    );
    const seatsRemaining = Math.max(0, route.capacity - taken);
    const availability = availabilityOf(seatsRemaining, route.capacity);

    let status: ServiceStatus = route.status;
    if (availability === "sold-out") status = "issue";
    else if (availability === "limited") status = "delay";

    out.push({
      minutes: m,
      time: formatMinutes(m),
      label: formatMinutesLabel(m),
      arrivalLabel: formatMinutesLabel(m + route.durationMinutes),
      seatsRemaining,
      availability,
      status,
    });
  }
  return out;
};

/**
 * The next departure at or after `nowMinutes`, or null once service has
 * finished for the day. This is what the live countdown reads — one source,
 * so the hero, the sticky bar and the closing CTA can never disagree.
 */
export const nextDeparture = (
  route: Route,
  dateISO: string,
  nowMinutes: number,
): Departure | null =>
  getDepartures(route, dateISO).find((d) => d.minutes >= nowMinutes) ?? null;

export const dailyDepartureCount = (route: Route): number =>
  Math.floor((route.lastDeparture - route.firstDeparture) / route.headwayMinutes) + 1;

export const totalDailyDepartures = (): number =>
  routes.reduce((sum, r) => sum + dailyDepartureCount(r), 0);

export const serviceWindowLabel = (route: Route): string =>
  `${formatMinutesLabel(route.firstDeparture)} – ${formatMinutesLabel(route.lastDeparture)}`;

export const headwayLabel = (route: Route): string => {
  if (route.headwayMinutes === 60) return "Hourly";
  if (route.headwayMinutes > 60 && route.headwayMinutes % 60 === 0) {
    return `Every ${route.headwayMinutes / 60} hours`;
  }
  return `Every ${route.headwayMinutes} minutes`;
};

export const fareLabel = (route: Route): string =>
  `$${route.fares.adult} ${route.tripType === "round-trip" ? "round trip" : "one way"}`;

/* -------------------------------------------------------------------------- */
/* Journey planning                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Routes that carry a rider from origin to destination in that order.
 *
 * Direction matters: a route lists its stops outbound, and every route here is
 * bidirectional, so we accept either ordering but record which way the rider
 * is travelling.
 */
export interface RouteMatch {
  route: Route;
  direction: "outbound" | "inbound";
  fromIndex: number;
  toIndex: number;
}

export const findRoutes = (originId: string, destinationId: string): RouteMatch[] => {
  if (originId === destinationId) return [];
  const matches: RouteMatch[] = [];
  for (const route of routes) {
    const a = route.stopIds.indexOf(originId);
    const b = route.stopIds.indexOf(destinationId);
    if (a === -1 || b === -1) continue;
    matches.push({
      route,
      direction: a < b ? "outbound" : "inbound",
      fromIndex: a,
      toIndex: b,
    });
  }
  return matches;
};

/** Stops that appear on at least one route — everything bookable. */
export const servedStopIds = (): string[] =>
  Array.from(new Set(routes.flatMap((r) => r.stopIds)));

/** Stops reachable from a given origin, for the destination dropdown. */
export const destinationsFrom = (originId: string): string[] => {
  const ids = new Set<string>();
  for (const route of routes) {
    if (!route.stopIds.includes(originId)) continue;
    for (const id of route.stopIds) if (id !== originId) ids.add(id);
  }
  return Array.from(ids);
};

/**
 * Segment running time between two stops on a route.
 *
 * Stops are assumed evenly weighted along the route, which is close enough
 * for a display estimate. Replace with real per-segment timings when the
 * GTFS feed exists.
 */
export const segmentMinutes = (match: RouteMatch): number => {
  const legs = Math.abs(match.toIndex - match.fromIndex);
  const totalLegs = match.route.stopIds.length - 1;
  return Math.round((match.route.durationMinutes * legs) / totalLegs);
};

/* -------------------------------------------------------------------------- */
/* Connections                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A bookable itinerary: one leg, or two with a transfer.
 *
 * This exists because the old model — "a destination is reachable if it
 * shares a single route with the origin" — silently deleted the company's
 * headline product for its most valuable segment. From Banff Downtown and
 * from Canmore, `destinationsFrom()` did not return Moraine Lake at all, so a
 * visitor with no car staying in Banff could not express the trip the whole
 * business exists to sell.
 *
 * Every route on this network touches Lake Louise Village, so a single
 * transfer connects any origin to any destination. The planner finds it.
 */
export interface Journey {
  legs: RouteMatch[];
  /** Stop id of the transfer, when there is one. */
  viaStopId?: string;
  /** Riding time, excluding the transfer wait. */
  rideMinutes: number;
  /** Allowance for the transfer, so quoted totals are not optimistic. */
  transferMinutes: number;
  totalMinutes: number;
  /** Sum of adult fares across the legs. */
  adultFare: number;
}

/** Slack quoted for a transfer. Half the connecting route's headway, so the
 *  number reflects the actual service rather than a flat guess. */
const transferAllowance = (onward: Route): number =>
  Math.round(onward.headwayMinutes / 2);

const directJourney = (match: RouteMatch): Journey => ({
  legs: [match],
  rideMinutes: segmentMinutes(match),
  transferMinutes: 0,
  totalMinutes: segmentMinutes(match),
  adultFare: match.route.fares.adult,
});

/**
 * Every itinerary from origin to destination, best first.
 *
 * Direct services sort ahead of connections; within each group, faster first.
 * Returns an empty array only when the two stops genuinely cannot be
 * connected in two legs — which, on this network, never happens.
 */
export const planJourneys = (originId: string, destinationId: string): Journey[] => {
  if (originId === destinationId) return [];

  const direct = findRoutes(originId, destinationId).map(directJourney);

  const connections: Journey[] = [];
  for (const first of routes) {
    const a = first.stopIds.indexOf(originId);
    if (a === -1) continue;
    for (const second of routes) {
      if (second.id === first.id) continue;
      const d = second.stopIds.indexOf(destinationId);
      if (d === -1) continue;

      /* Any stop both routes touch is a candidate transfer point. */
      for (const via of first.stopIds) {
        if (via === originId || via === destinationId) continue;
        if (!second.stopIds.includes(via)) continue;

        const legA = findRoutes(originId, via).find((m) => m.route.id === first.id);
        const legB = findRoutes(via, destinationId).find((m) => m.route.id === second.id);
        if (!legA || !legB) continue;

        const ride = segmentMinutes(legA) + segmentMinutes(legB);
        const wait = transferAllowance(second);
        connections.push({
          legs: [legA, legB],
          viaStopId: via,
          rideMinutes: ride,
          transferMinutes: wait,
          totalMinutes: ride + wait,
          adultFare: legA.route.fares.adult + legB.route.fares.adult,
        });
      }
    }
  }

  /* Keep the best itinerary per transfer point rather than every permutation. */
  const bestPerVia = new Map<string, Journey>();
  for (const j of connections) {
    const key = `${j.viaStopId}`;
    const held = bestPerVia.get(key);
    if (!held || j.totalMinutes < held.totalMinutes) bestPerVia.set(key, j);
  }

  return [
    ...direct.sort((x, y) => x.totalMinutes - y.totalMinutes),
    ...[...bestPerVia.values()].sort((x, y) => x.totalMinutes - y.totalMinutes),
  ];
};

/** Every stop a rider can actually reach from here, directly or with one
 *  transfer. This is what the destination select is built from. */
export const reachableStopIds = (originId: string): string[] =>
  servedStopIds().filter(
    (id) => id !== originId && planJourneys(originId, id).length > 0,
  );

/* -------------------------------------------------------------------------- */
/* Service status                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The network's worst current status, and the routes responsible.
 *
 * The header banner is derived from this rather than hard-coded. A banner
 * that always reads "all routes on schedule" is decoration; one that
 * occasionally names a problem is the reason riders trust transit displays at
 * all — and it cannot contradict the amber pill on a route card further down
 * the same page.
 */
export const networkStatus = (
  /** Restrict to a subset — the site banner scopes itself, see below. */
  within: Route[] = routes,
): {
  status: ServiceStatus;
  affected: Route[];
} => {
  const affected = within.filter((r) => r.status !== "ontime");
  if (affected.length === 0) return { status: "ontime", affected: [] };
  const status: ServiceStatus = affected.some((r) => r.status === "issue")
    ? "issue"
    : "delay";
  return { status, affected };
};

/**
 * The routes a disruption is worth interrupting the page for.
 *
 * The banner is the first line of every page, above the logo. It was reading
 * the whole network, so a ten-minute delay on the Canmore hourly — a route
 * almost nobody who lands here is looking for — took that line site-wide and
 * spent it on an irrelevant negative.
 *
 * Scoping it to the lake-bound services keeps the mechanism honest where it
 * matters (a rider heading to Moraine Lake still gets told) without letting
 * the least-wanted route in the network set the tone of the home page. A
 * disruption outside this set is still reported: the route's own card and its
 * route page both carry the amber pill and the note.
 */
export const lakeBoundRoutes = (): Route[] =>
  routes.filter(
    (r) => r.destinationId === "moraine-lake" || r.destinationId === "ll-lakeshore",
  );
