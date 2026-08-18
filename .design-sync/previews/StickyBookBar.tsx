import { useEffect } from "react";
import { StickyBookBar, routes, getDepartures, stopById } from "shuttlecompany";

/**
 * The persistent mobile booking bar.
 *
 * Three behaviours make it awkward to preview, and all three are deliberate:
 * it is `sm:hidden` (phone widths only), it stays translated off-screen until
 * the visitor has scrolled past the hero, and it removes itself entirely
 * inside `/book` so it never competes with the funnel's own call to action.
 *
 * The card is therefore pinned to a phone viewport, given enough page height
 * to scroll, and scrolled past the reveal threshold on mount. The component is
 * untouched — only its environment is staged, which is the only way this state
 * exists at all.
 */
const DATE = "2026-08-12";

const departures = routes
  .flatMap((route) =>
    getDepartures(route, DATE)
      .slice(0, 4)
      .map((d) => ({
        time: d.time,
        label: d.label,
        minutes: d.minutes,
        destination: stopById(route.destinationId).shortName,
        routeSlug: route.slug,
        fare: route.fares.adult,
      })),
  )
  .sort((a, b) => a.minutes - b.minutes);

/** Gives the document real height and scrolls past the bar's reveal threshold. */
function ScrolledPage({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 600);
    window.dispatchEvent(new Event("scroll"));
  }, []);
  return (
    <>
      <div className="h-[1400px] px-4 py-6">
        <p className="font-display text-2xl font-bold text-ink">Moraine Lake Express</p>
        <p className="mt-2 text-sm text-ink-muted">
          Every 20 minutes from Lake Louise Village. The booking bar re-enters after the
          hero and follows you down the page.
        </p>
      </div>
      {children}
    </>
  );
}

export function ShownOnAPhone() {
  return (
    <ScrolledPage>
      <StickyBookBar departures={departures} />
    </ScrolledPage>
  );
}

/** With nothing left today the bar still offers the funnel rather than vanishing. */
export function NoDeparturesLeft() {
  return (
    <ScrolledPage>
      <StickyBookBar departures={[]} />
    </ScrolledPage>
  );
}
