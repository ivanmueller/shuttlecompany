import { SeatsPill } from "shuttlecompany";

/**
 * Every availability state, in the order a departure degrades through them.
 *
 * Two deliberate behaviours to know before using this:
 * - `wide-open` and `available` are the same green status, differing only in
 *   label — scarcity is never manufactured where it is not true.
 * - the `seats` count is suppressed unless `site.inventoryIsLive` is true, so
 *   today `limited` reads "Almost full" rather than "Only 3 seats left".
 *   Passing `seats` is still correct: it starts showing the moment a live
 *   inventory feed is wired up.
 */
export function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SeatsPill availability="wide-open" seats={41} />
      <SeatsPill availability="available" seats={16} />
      <SeatsPill availability="limited" seats={3} />
      <SeatsPill availability="sold-out" seats={0} />
    </div>
  );
}

/** How it actually appears — inline on a departure row. */
export function OnADepartureRow() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {[
        { time: "9:40 am", availability: "limited", seats: 3 },
        { time: "10:00 am", availability: "available", seats: 14 },
        { time: "10:20 am", availability: "sold-out", seats: 0 },
      ].map((row) => (
        <div key={row.time} className="flex items-center justify-between gap-6 py-3">
          <span className="font-mono text-sm font-semibold text-ink">{row.time}</span>
          <span className="text-sm text-ink-muted">Moraine Lake Express</span>
          <SeatsPill
            availability={row.availability as "limited" | "available" | "sold-out"}
            seats={row.seats}
          />
        </div>
      ))}
    </div>
  );
}
