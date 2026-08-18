import { ConfirmedClient } from "shuttlecompany";

/**
 * The confirmation page, treated as a conversion surface rather than a
 * receipt: it prevents no-shows with a pre-departure checklist and offers the
 * second lake while intent is highest.
 *
 * Like `CheckoutClient` it rebuilds the booking from the query string, so the
 * story seeds one before rendering.
 */
if (typeof window !== "undefined") {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("route")) {
    url.searchParams.set("route", "moraine-lake-express");
    url.searchParams.set("date", "2026-08-12");
    url.searchParams.set("time", "09:40");
    url.searchParams.set("email", "rider@example.com");
    window.history.replaceState(null, "", url);
  }
}

export function Confirmed() {
  return <ConfirmedClient />;
}
