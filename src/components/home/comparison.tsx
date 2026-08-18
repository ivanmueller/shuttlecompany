import { comparisonRows, comparisonColumns } from "@/data/comparison";
import { SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/config/site";

/**
 * The comparison table.
 *
 * Two jobs. For the visitor, it resolves the "which shuttle do I actually
 * book?" question that they would otherwise resolve on a Reddit thread and
 * never come back from. For search, it is the page that ranks for
 * "parks canada shuttle vs moraine lake bus" and every variant of it.
 *
 * It concedes the row where we lose, on purpose. A table where the challenger
 * wins every line is read as marketing and discounted entirely; one honest
 * concession makes the other seven credible.
 */
export function ComparisonTable() {
  return (
    <div>
      <SectionHeading
        eyebrow="Straight comparison"
        title="Which shuttle should you actually book?"
        lede="Parks Canada is the cheapest way to reach Moraine Lake, if you can get a seat. Most visitors cannot. Here is the honest version."
      />

      {/* One DOM, two layouts. See `.reflow-table` in globals.css: this used
          to render a desktop table *and* a stacked card list into every
          response, with one of them hidden. */}
      <div className="mt-12 overflow-x-auto md:rounded-[var(--radius)] md:border md:border-line">
        <table className="reflow-table w-full border-collapse text-sm md:min-w-[52rem]">
          <caption className="sr-only">
            Comparison of {site.name} with the Parks Canada shuttle, Roam Transit and
            Moraine Lake Bus Company
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[22%] bg-sunken px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle">
                What matters
              </th>
              {comparisonColumns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={
                    col.us
                      ? "bg-brand-800 px-5 py-4 text-left font-sans text-[0.9375rem] font-bold text-white"
                      : "bg-sunken px-5 py-4 text-left font-sans text-[0.9375rem] font-semibold text-ink-muted"
                  }
                >
                  {col.label}
                  {col.us && (
                    <span className="mt-0.5 block text-[0.625rem] font-medium uppercase tracking-[0.1em] text-brand-200">
                      That&apos;s us
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="md:divide-y md:divide-line">
            {comparisonRows.map((row) => (
              <tr key={row.criterion} className="align-top">
                <th scope="row" className="bg-sunken/50 px-5 py-4 text-left">
                  <span className="block font-semibold text-ink">{row.criterion}</span>
                  {row.detail && (
                    <span className="mt-1 block text-xs font-normal leading-relaxed text-ink-subtle">
                      {row.detail}
                    </span>
                  )}
                </th>
                {comparisonColumns.map((col) => {
                  const winner =
                    (col.us && row.verdict === "us") ||
                    (!col.us && row.verdict === "them" && col.key === "parksCanada");
                  return (
                    <td
                      key={col.key}
                      data-label={col.label}
                      data-us={col.us ? "true" : undefined}
                      className={`px-5 py-4 leading-relaxed ${
                        col.us
                          ? "bg-brand-50/60 font-medium text-ink"
                          : "text-ink-muted"
                      }`}
                    >
                      <span className="flex gap-2">
                        {winner && (
                          <svg
                            viewBox="0 0 16 16"
                            aria-label="Best in this row"
                            role="img"
                            className="mt-0.5 size-4 shrink-0 text-ontime"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 8.5 6.5 12 13 4.5" />
                          </svg>
                        )}
                        <span>{row[col.key]}</span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink-subtle">
        Competitor details verified {site.benchmarks.checkedOn} from each operator&apos;s
        public website and re-checked each season. Fares exclude the Parks Canada park
        pass, which every visitor needs regardless of how they travel.{" "}
        {site.name} is not affiliated with Parks Canada, Roam Transit or Moraine Lake Bus
        Company.
      </p>

      {/* A real call to action at the end of the argument. This section used
          to finish on a substantiation footnote and hand straight over to the
          next heading, at one of the two highest-intent moments on the page. */}
      <div className="mt-8">
        <ButtonLink href="/book?to=moraine-lake" size="lg">
          Book a seat
        </ButtonLink>
      </div>
    </div>
  );
}
