import { Timetable, routeBySlug } from "shuttlecompany";

/**
 * A real route on a real in-season date.
 *
 * The date is pinned rather than `todayISO()` so the card renders identically
 * on every build — a moving date would re-hash the preview daily and make
 * every re-sync look like a change.
 */
const DATE = "2026-08-12";

export function MoraineLakeExpress() {
  return <Timetable route={routeBySlug("moraine-lake-express")!} dateISO={DATE} limit={8} />;
}

/** The connector runs a longer headway, so the same component reads very differently. */
export function BanffConnector() {
  return <Timetable route={routeBySlug("banff-lake-louise-connector")!} dateISO={DATE} limit={6} />;
}

/** Unlimited — the full published day, which is what the schedule pages render. */
export function FullDay() {
  return <Timetable route={routeBySlug("moraine-lake-sunrise")!} dateISO={DATE} />;
}
