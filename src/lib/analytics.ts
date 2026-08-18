/**
 * Event instrumentation.
 *
 * Before this file the site recorded nothing at all — no page views, no
 * searches, no checkout starts — which meant every conversion decision was an
 * argument rather than a measurement. This is the smallest thing that fixes
 * that.
 *
 * Design constraints, in the order they mattered:
 *
 *  1. **Vendor-neutral.** `track()` pushes onto a queue and calls whatever
 *     sink is registered. Choosing an analytics product is a business
 *     decision; being unable to make it should not block instrumentation.
 *  2. **Cookieless by default.** A large share of this traffic is EU and UK
 *     residents, so GDPR/PECR consent applies to non-essential cookies
 *     wherever you are incorporated. Nothing here sets a cookie or a
 *     persistent identifier, so no banner is required — and a consent dialog
 *     over the hero is itself a conversion cost you can decline to pay.
 *  3. **Revenue is server-side.** `booking_confirmed` must be emitted from
 *     the payment webhook, not the browser. Client-side revenue events are
 *     wrong by 10–30% from blockers alone. The client event here is for
 *     funnel shape only.
 */

export type AnalyticsEvent =
  /* Search and discovery */
  | { name: "search_submitted"; from: string; to: string; daysAhead: number; pax: number; connecting: boolean }
  | { name: "origin_switched"; to: string }
  | { name: "board_filtered"; destination: string }
  /* Departure selection */
  | { name: "departure_selected"; route: string; time: string; availability: string; minutesUntil: number | null; surface: string }
  /**
   * The most commercially valuable event here. It does not measure the
   * funnel — it tells you which departures to add buses to, which is the
   * actual business decision behind this whole enterprise.
   */
  | { name: "sold_out_seen"; route: string; time: string; date: string }
  /* Checkout */
  | { name: "checkout_started"; route: string; fareTotal: number; adults: number; seniors: number; youth: number; children: number }
  | { name: "checkout_error"; field: string }
  | { name: "payment_submitted"; route: string; fareTotal: number }
  /* Page-level */
  | { name: "cta_clicked"; id: string; scrollDepth: number };

type Sink = (event: AnalyticsEvent & { ts: number; path: string }) => void;

let sink: Sink | null = null;
const queue: (AnalyticsEvent & { ts: number; path: string })[] = [];

/** Register the destination. Call once, from a client component at the root. */
export const registerAnalyticsSink = (next: Sink): void => {
  sink = next;
  while (queue.length) {
    const event = queue.shift();
    if (event) sink(event);
  }
};

export const track = (event: AnalyticsEvent): void => {
  if (typeof window === "undefined") return;
  const enriched = {
    ...event,
    ts: Date.now(),
    path: window.location.pathname,
  };
  if (sink) {
    sink(enriched);
  } else if (queue.length < 200) {
    /* Bounded: until a sink is registered this holds the session's opening
       events so nothing is lost on a slow analytics load. It is not a buffer
       for a sink that never arrives. */
    queue.push(enriched);
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", enriched.name, enriched);
  }
};

/** Percentage of the document scrolled, for CTA attribution. */
export const scrollDepth = (): number => {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max <= 0 ? 0 : Math.round((window.scrollY / max) * 100);
};
