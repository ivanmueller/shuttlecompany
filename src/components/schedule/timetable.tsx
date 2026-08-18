import Link from "next/link";
import { getDepartures, type Route } from "@/data/network";
import { SeatsPill } from "@/components/ui/status-pill";
import { formatDateLong } from "@/lib/utils";

/**
 * Full-day timetable for one route.
 *
 * Rendered as a real <table> rather than a grid of divs: riders scan
 * timetables in columns, screen readers announce the row header, and a
 * printed page is a genuine use case at a park-and-ride with no signal.
 */
export function Timetable({
  route,
  dateISO,
  limit,
}: {
  route: Route;
  dateISO: string;
  limit?: number;
}) {
  const all = getDepartures(route, dateISO);
  const departures = limit ? all.slice(0, limit) : all;
  const soldOut = all.filter((d) => d.seatsRemaining === 0).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 pb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-ink">
            Route {route.number} timetable
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {formatDateLong(dateISO)} · {all.length} departures
            {soldOut > 0 && (
              <span className="text-issue-ink"> · {soldOut} sold out</span>
            )}
          </p>
        </div>
        <p className="text-xs text-ink-subtle">All times Mountain Time (MDT)</p>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius)] border border-line">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <caption className="sr-only">
            Departure times, arrival times and seat availability for Route{" "}
            {route.number} on {formatDateLong(dateISO)}
          </caption>
          <thead>
            <tr className="bg-sunken text-left">
              <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle">
                Departs
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle">
                Arrives
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle">
                Availability
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle">
                <span className="sr-only">Book</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {departures.map((d) => {
              const full = d.seatsRemaining === 0;
              return (
                <tr key={d.time} className={full ? "bg-sunken/60" : "hover:bg-brand-50/50"}>
                  <th
                    scope="row"
                    className="whitespace-nowrap px-4 py-3 text-left font-semibold text-ink tabular"
                  >
                    {d.label}
                  </th>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-muted tabular">
                    {d.arrivalLabel}
                  </td>
                  <td className="px-4 py-3">
                    <SeatsPill availability={d.availability} seats={d.seatsRemaining} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {full ? (
                      <span className="text-xs text-ink-subtle">Try another time</span>
                    ) : (
                      <Link
                        href={`/book?route=${route.slug}&date=${dateISO}&time=${d.time}`}
                        className="text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
                      >
                        Book{" "}
                        <span className="sr-only">
                          the {d.label} departure on Route {route.number}
                        </span>
                        →
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {limit && all.length > limit && (
        <p className="mt-3 text-sm text-ink-muted">
          Showing the first {limit} of {all.length} departures.{" "}
          <Link
            href={`/routes/${route.slug}`}
            className="font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            See the full timetable
          </Link>
        </p>
      )}
    </div>
  );
}
