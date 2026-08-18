import { site } from "@/config/site";
import { routeBySlug } from "@/data/network";
import { formatCad } from "@/lib/utils";

/**
 * The three rows that answer the question people arrived with.
 *
 * The full four-column table is the strongest asset on this site — honest,
 * specific, and it concedes the row it loses. It also used to begin around
 * pixel 4,992 on a phone and run 3,482px, which is four screens of stacked
 * cards that most visitors never reach.
 *
 * So it is split. This compressed version sits directly under the hero, under
 * the heading people actually type into Google. The full table stays further
 * down, where it still earns "parks canada shuttle vs moraine lake bus".
 */

const ROWS = [
  {
    criterion: "Getting a seat",
    parks: "Reservation-only, released in windows that sell out in minutes.",
    ours: "Seats released daily, including same day.",
  },
  {
    criterion: "Coming back",
    parks: "Return slot assigned when you book.",
    ours: "Any bus with an open seat, whenever you're ready.",
  },
  {
    criterion: "Fare",
    parks: `$${site.benchmarks.parksCanadaMoraineRoundTrip} — genuinely cheaper than us, if you can get one.`,
    ours: `${formatCad(routeBySlug("moraine-lake-express")?.fares.adult ?? 29)} round trip. Under 6 free.`,
  },
];

export function QuickComparison() {
  return (
    <div>
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
          Straight comparison
        </p>
        <h2 className="text-3xl font-bold text-ink md:text-[2.25rem] md:leading-[1.12]">
          Parks Canada sold out? Here&apos;s the difference.
        </h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {ROWS.map((row) => (
          <div
            key={row.criterion}
            className="overflow-hidden rounded-[var(--radius)] border border-line bg-paper"
          >
            <h3 className="border-b border-line bg-sunken px-4 py-2.5 font-sans text-[0.9375rem] font-bold text-ink">
              {row.criterion}
            </h3>
            <dl className="divide-y divide-line text-sm">
              <div className="px-4 py-3">
                <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-subtle">
                  Parks Canada
                </dt>
                <dd className="mt-1 leading-relaxed text-ink-muted">{row.parks}</dd>
              </div>
              <div className="bg-brand-50/70 px-4 py-3">
                <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-brand-700">
                  {site.name}
                </dt>
                <dd className="mt-1 font-medium leading-relaxed text-ink">{row.ours}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-ink-subtle">
        Verified {site.benchmarks.checkedOn} from each operator&apos;s public website.
        Fares exclude the Parks Canada park pass, which every visitor needs however
        they travel. {site.name} is not affiliated with Parks Canada.
      </p>
    </div>
  );
}
