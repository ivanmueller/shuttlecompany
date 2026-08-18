import Link from "next/link";
import { site } from "@/config/site";
import { routeBySlug } from "@/data/network";
import { formatCad } from "@/lib/utils";

/**
 * Why us — the comparison and what is included, in one pass.
 *
 * This section replaces two that used to run back to back and largely say the
 * same thing. The compressed comparison claimed "seats released daily" and
 * "any bus with an open seat"; the trust strip immediately beneath it claimed
 * "seats released every day" and "return whenever you like". Two blocks,
 * 1,644px of a phone page, four claims, two of them stated twice within a
 * screen of each other.
 *
 * Across the whole home page the audit found the seat-release claim in eight
 * of ten sections and the open-return claim in seven. That is what read as
 * clutter: not decoration, but a reader repeatedly checking whether a block is
 * new and finding that it is not.
 *
 * So each claim is made once. The three that answer "why not Parks Canada?"
 * are the comparison; the two that nothing else on the page covers — parking
 * and knowing where to stand — follow it as a short strip. The full
 * four-operator table is not reproduced here: it already lives on
 * /parks-canada-shuttle-alternative, whose entire job is that question, and
 * shipping a second copy 4,052px tall to the home page was pure duplication.
 */

const COMPARISON = [
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

/* The two things the comparison above does not already cover. Every other
   item that used to sit in this strip restated a row of it. */
const INCLUDED = [
  {
    title: "Free parking, guaranteed",
    body: `${site.proof.parkingSpaces}+ reserved spaces at the Gondola Park & Ride, held until your departure. No add-on, no day rate.`,
    icon: <path d="M5 20V7a2 2 0 0 1 2-2h4.5a4.5 4.5 0 0 1 0 9H8" />,
  },
  {
    title: "You'll be in the right place",
    body: "Your ticket carries a photo and a map of the exact boarding bay. Screenshot it before you go — there is no cell service at Moraine Lake.",
    icon: (
      <>
        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
        <path d="M20 4v4.5h-4.5" />
      </>
    ),
  },
];

export function WhyUs() {
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
        {COMPARISON.map((row) => (
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

      {/* The full table, where it already lived. */}
      <p className="mt-5">
        <Link
          href="/parks-canada-shuttle-alternative"
          className="inline-block py-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          Compare all four operators, row by row →
        </Link>
      </p>

      <ul className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 sm:gap-8">
        {INCLUDED.map((item) => (
          <li key={item.title} className="flex gap-3.5">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-[var(--radius)] bg-brand-50 text-brand-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
            </span>
            <div>
              <h3 className="font-sans text-[0.9375rem] font-bold text-ink">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs leading-relaxed text-ink-subtle">
        Verified {site.benchmarks.checkedOn} from each operator&apos;s public website.
        Fares exclude the Parks Canada park pass, which every visitor needs however
        they travel. {site.name} is not affiliated with Parks Canada.
      </p>
    </div>
  );
}
