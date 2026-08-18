import { BookingClient } from "shuttlecompany";

/**
 * The departure-picking step of the booking funnel — the whole `/book` page
 * body: origin/destination, date strip, the departures list and the trip
 * summary with the fare breakdown.
 *
 * It reads its initial state from the query string (`route`, `from`, `to`,
 * `date`, `time`, `pax`) and falls back to sensible defaults, so it renders
 * complete with no props at all.
 */
export function Default() {
  return <BookingClient />;
}
