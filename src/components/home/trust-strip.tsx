/**
 * Trust strip.
 *
 * Placed immediately under the hero because that is where the "is this a real
 * company or a scraper site?" question gets asked. Every competitor runs a
 * version of this; ours differs in being specific — "600+ free spaces" is
 * checkable, "convenient parking" is not, and specificity is what actually
 * moves a hesitant booker.
 */

const items = [
  {
    title: "Free parking, guaranteed",
    body: "600+ reserved spaces at the Gondola Park & Ride, held until your departure. Included with every booking — no add-on, no day rate.",
    icon: (
      <path d="M5 20V7a2 2 0 0 1 2-2h4.5a4.5 4.5 0 0 1 0 9H8" />
    ),
  },
  {
    title: "Seats released every day",
    body: "We hold back a share of every departure for same-day sale, so missing a reservation window does not mean missing the lake.",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4M8.5 14.5h3" />
      </>
    ),
  },
  {
    title: "Return whenever you like",
    body: "Book an outbound time and come back on any bus with an open seat. Stay 40 minutes for the photo or all day for Larch Valley.",
    icon: (
      <>
        <path d="M4 9h13a4 4 0 0 1 0 8h-6" />
        <path d="M7.5 5.5 4 9l3.5 3.5" />
      </>
    ),
  },
  {
    title: "Free changes, real refunds",
    body: "Change your date or time free up to 2 hours before departure. Cancel 24 hours out for a full refund, not a credit note.",
    icon: (
      <>
        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
        <path d="M20 4v4.5h-4.5" />
      </>
    ),
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-line bg-paper py-12 md:py-14">
      <div className="container-page">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {items.map((item) => (
            <li key={item.title} className="flex gap-3.5 lg:flex-col lg:gap-3">
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
      </div>
    </section>
  );
}
