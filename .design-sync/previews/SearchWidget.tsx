import { SearchWidget } from "shuttlecompany";

/**
 * The booking search: origin, destination, date, and "Find departures".
 *
 * Every field is pre-filled so the primary action is reachable in one tap —
 * this is the first interactive element on the home page and the reason the
 * funnel starts above the fold.
 */
export function Raised() {
  return (
    <div className="rounded-[var(--radius)] bg-brand-900 p-8">
      <SearchWidget tone="raised" />
    </div>
  );
}

/** `flat` is the in-page form, used inside an ordinary section. */
export function Flat() {
  return <SearchWidget tone="flat" />;
}

/**
 * `origin` and `destination` let a parent drive the form without duplicating
 * its state — this is how the hero's origin router hands off. Here it is
 * seeded with the Banff → Lake Louise Lakeshore pairing rather than the
 * default village-to-Moraine one.
 */
export function PrefilledRoute() {
  return <SearchWidget tone="flat" origin="banff-downtown" destination="ll-lakeshore" />;
}
