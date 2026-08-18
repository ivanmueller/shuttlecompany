import { CheckoutClient } from "shuttlecompany";

/**
 * The traveller-details and payment step.
 *
 * It reconstructs the trip entirely from the query string, so a card with no
 * parameters renders the "we lost track of your departure" recovery state
 * rather than a form. The stories below seed a realistic query first — the
 * component itself is untouched.
 *
 * The card fields are inert placeholders that collect nothing; wiring Stripe
 * is a launch task, not a design-system one.
 */
if (typeof window !== "undefined") {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("route")) {
    url.searchParams.set("route", "moraine-lake-express");
    url.searchParams.set("date", "2026-08-12");
    url.searchParams.set("time", "09:40");
    url.searchParams.set("adult", "2");
    url.searchParams.set("youth", "1");
    window.history.replaceState(null, "", url);
  }
}

export function WithATrip() {
  return <CheckoutClient />;
}
