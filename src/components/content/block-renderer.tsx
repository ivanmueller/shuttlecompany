import Link from "next/link";
import type { Block } from "@/data/landing-pages";
import { routeBySlug } from "@/data/network";
import { faqs } from "@/data/faqs";
import { RouteCard } from "@/components/routes/route-card";
import { Timetable } from "@/components/schedule/timetable";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ComparisonTable } from "@/components/home/comparison";
import { todayISO } from "@/lib/utils";

/**
 * Renders a landing page's content blocks.
 *
 * Prose sits in a constrained measure (~68 characters) because that is where
 * long-form reads comfortably; tables, timetables and route cards break out to
 * full width because squeezing a timetable into a text column makes it useless.
 */

const calloutTone = {
  info: "border-info/20 bg-info-bg text-info-ink",
  ontime: "border-ontime/20 bg-ontime-bg text-ontime-ink",
  delay: "border-delay/20 bg-delay-bg text-delay-ink",
  issue: "border-issue/20 bg-issue-bg text-issue-ink",
} as const;

function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-bold text-ink md:text-[1.75rem]">
      {children}
    </h2>
  );
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  const today = todayISO();

  return (
    <div className="space-y-14">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "prose":
            return (
              <section key={i} className="max-w-[42rem]">
                {block.heading && <BlockHeading>{block.heading}</BlockHeading>}
                <div className="mt-4 space-y-4">
                  {block.paragraphs.map((p, j) => (
                    <p key={j} className="text-[1.0625rem] leading-relaxed text-ink-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            );

          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <section key={i} className="max-w-[46rem]">
                {block.heading && <BlockHeading>{block.heading}</BlockHeading>}
                {block.intro && (
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-muted">
                    {block.intro}
                  </p>
                )}
                <List className="mt-6 space-y-5">
                  {block.items.map((item, j) => (
                    <li key={item.title} className="flex gap-4">
                      <span
                        aria-hidden
                        className={
                          block.ordered
                            ? "grid size-7 shrink-0 place-items-center rounded-full bg-brand-800 font-display text-sm font-bold text-white"
                            : "mt-2 size-2 shrink-0 rounded-full bg-brand-600"
                        }
                      >
                        {block.ordered ? j + 1 : null}
                      </span>
                      <div>
                        <h3 className="font-sans text-[1.0625rem] font-bold text-ink">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 leading-relaxed text-ink-muted">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </List>
              </section>
            );
          }

          case "table":
            return (
              <section key={i}>
                {block.heading && <BlockHeading>{block.heading}</BlockHeading>}
                {block.intro && (
                  <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-relaxed text-ink-muted">
                    {block.intro}
                  </p>
                )}
                <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-line">
                  <table className="w-full min-w-[40rem] border-collapse text-sm">
                    <thead>
                      <tr className="bg-sunken text-left">
                        {block.columns.map((col) => (
                          <th
                            key={col}
                            scope="col"
                            className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-subtle"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {block.rows.map((row) => (
                        <tr key={row[0]} className="align-top">
                          <th
                            scope="row"
                            className="px-4 py-3.5 text-left font-semibold text-ink"
                          >
                            {row[0]}
                          </th>
                          {row.slice(1).map((cell, k) => (
                            <td key={k} className="px-4 py-3.5 leading-relaxed text-ink-muted">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.note && (
                  <p className="mt-3 text-xs leading-relaxed text-ink-subtle">{block.note}</p>
                )}
              </section>
            );

          case "callout":
            return (
              <aside
                key={i}
                className={`max-w-[46rem] rounded-[var(--radius)] border p-5 ${calloutTone[block.tone]}`}
              >
                <h2 className="font-display text-lg font-bold">{block.heading}</h2>
                <p className="mt-2 leading-relaxed">{block.body}</p>
              </aside>
            );

          case "routes": {
            const list = block.slugs
              .map((slug) => routeBySlug(slug))
              .filter((r): r is NonNullable<typeof r> => Boolean(r));
            if (list.length === 0) return null;
            return (
              <section key={i}>
                {block.heading && <BlockHeading>{block.heading}</BlockHeading>}
                {block.intro && (
                  <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-relaxed text-ink-muted">
                    {block.intro}
                  </p>
                )}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((route) => (
                    <RouteCard key={route.id} route={route} />
                  ))}
                </div>
              </section>
            );
          }

          case "timetable": {
            const route = routeBySlug(block.routeSlug);
            if (!route) return null;
            return (
              <section key={i}>
                {block.heading && <BlockHeading>{block.heading}</BlockHeading>}
                <div className="mt-6">
                  <Timetable route={route} dateISO={today} limit={block.limit} />
                </div>
              </section>
            );
          }

          case "faq": {
            const items = block.questions
              .map((q) => faqs.find((f) => f.q === q))
              .filter((f): f is NonNullable<typeof f> => Boolean(f));
            if (items.length === 0) return null;
            return (
              <section key={i} className="max-w-[46rem]">
                {block.heading && <BlockHeading>{block.heading}</BlockHeading>}
                <FaqAccordion items={items} className="mt-6" />
                <p className="mt-4 text-sm text-ink-muted">
                  <Link
                    href="/faq"
                    className="font-semibold text-brand-700 underline-offset-4 hover:underline"
                  >
                    Read all 30+ answers →
                  </Link>
                </p>
              </section>
            );
          }

          case "comparison":
            return (
              <section key={i}>
                <ComparisonTable />
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
