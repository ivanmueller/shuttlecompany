/**
 * Single source of truth for brand-swappable identity.
 *
 * Everything here is a placeholder chosen to be plausible and internally
 * consistent — replace with the real operating details before launch.
 * Nothing in the codebase hard-codes these strings.
 */

/**
 * Whether this build is the live production deployment.
 *
 * Vercel gives every branch and every commit its own preview URL, which is
 * exactly what makes it easy to review changes — and also a genuine SEO
 * hazard, because those URLs get discovered and can be indexed as duplicates
 * of the real site. Preview builds are therefore marked noindex in
 * `app/layout.tsx`.
 *
 * The variable is unset locally, where indexing is not a concern either way.
 */
export const isProductionDeploy =
  (process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production") === "production";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProduction = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  return "https://larchline.ca";
}

export const site = {
  /** Placeholder name. "Larch Line" references Larch Valley above Moraine Lake:
   *  local, ownable, and not confusable with Roam or Moraine Lake Bus Company. */
  name: "Larch Line",
  legalName: "Larch Line Transit Ltd.",
  tagline: "Frequent shuttles to Moraine Lake & Lake Louise",

  /**
   * Public origin, no trailing slash. Used for canonical URLs, the sitemap,
   * OG tags and every JSON-LD `@id`.
   *
   * Resolution order:
   *   1. NEXT_PUBLIC_SITE_URL — set this once the real domain is attached.
   *   2. The Vercel production domain, which Vercel injects automatically.
   *      This means canonicals are correct on the very first deploy, before
   *      any environment variable has been configured by hand.
   *   3. The placeholder, for local development.
   *
   * The production domain is used rather than the per-deployment URL on
   * purpose: a preview deploy must not advertise itself as canonical.
   */
  url: resolveSiteUrl(),

  contact: {
    phone: "+1-403-555-0142",
    phoneDisplay: "403-555-0142",
    tollFree: "+1-833-555-0142",
    tollFreeDisplay: "1-833-555-0142",
    email: "hello@larchline.ca",
    supportEmail: "support@larchline.ca",
  },

  address: {
    street: "101 Village Road",
    locality: "Lake Louise",
    region: "AB",
    postalCode: "T0L 1E0",
    country: "CA",
  },

  /** Approximate coordinates of the Lake Louise Village transit hub. */
  geo: { lat: 51.4254, lng: -116.1773 },

  social: {
    instagram: "https://instagram.com/larchline",
    facebook: "https://facebook.com/larchline",
  },

  /** Operating window. Banff National Park shuttle season conventions. */
  season: {
    startISO: "2026-05-15",
    endISO: "2026-10-13",
    label: "May 15 – October 13, 2026",
    year: 2026,
  },

  /**
   * Verifiable operating facts only.
   *
   * Nothing here may be a number we cannot substantiate on request. Ratings,
   * review counts and on-time percentages were removed rather than guarded by
   * a flag: a fabricated figure in the source is a figure that eventually
   * ships. Re-add them under `reviews` once they are real and syndicated.
   */
  proof: {
    /** Free spaces held at the Gondola Park & Ride. Countable. */
    parkingSpaces: 600,
    /** Set once reviews exist and are syndicated. Until then the home page
     *  carries operator credentials instead of stars, and `schema.ts` emits
     *  no aggregateRating. */
    reviews: null as null | { ratingValue: number; reviewCount: number },
  },

  /**
   * Regulatory credentials.
   *
   * Each renders only when set, so the site never claims a licence it does
   * not hold. Fill these in from the actual certificates before launch —
   * for a new operator these do more work than a star rating would.
   */
  credentials: {
    /** Alberta / NSC safety fitness certificate number. */
    nscNumber: null as string | null,
    /** Parks Canada business licence for commercial operation in the park. */
    parksCanadaLicence: null as string | null,
    /** Public liability cover, in CAD. */
    liabilityCoverCad: null as number | null,
    /** Named accountable person. A face and a name outperform a badge. */
    operatorName: null as string | null,
  },

  /**
   * Hero backdrop photograph.
   *
   * `null` renders the drawn `AlpineScene` instead, which is what ships today.
   * Set this and the hero swaps to a real photograph — no component edit, and
   * the scrim, the headline treatment and the LCP handling stay as they are.
   *
   *   1. Put the file in `public/`, ~2400px wide, JPEG or WebP, under 400 kB.
   *   2. Set `src` to its path.
   *   3. Leave `alt` empty unless the photograph carries information the
   *      headline does not. It sits behind a scrim under an <h1> that already
   *      names the destination, so it is decorative in the WCAG sense and an
   *      alt string here is noise in a screen reader.
   *   4. `focus` is the CSS object-position. The headline and the booking card
   *      occupy the left third on desktop, so keep the subject right of centre
   *      — "70% 50%" is the usual answer for a wide mountain frame.
   *   5. `credit` renders in the footer fine print. Required for most stock
   *      licences and for anything Creative Commons; leave `null` only for a
   *      photograph the company owns outright.
   *
   * See docs/BRAND.md §8 for what the photograph should actually be of.
   */
  heroPhoto: {
    /** Lake Louise lakeshore and boathouse — Route 3's destination.
     *  Upload the file to `public/` under exactly this name; see
     *  `public/README.md`. Until it exists the hero falls back to the drawn
     *  AlpineScene rather than rendering a broken image. */
    src: "/hero-lake-louise.jpg",
    /** Empty on purpose. The photograph sits behind a scrim under an <h1>
     *  that already names the destination, so it is decorative in the WCAG
     *  sense and an alt string here is noise in a screen reader. */
    alt: "",
    /** The hero is far wider than tall, so a 3:2 source is cropped
     *  vertically and the Y value is the one doing the work. 35% keeps the
     *  ridgeline and the boathouse band and crops the busy foreground out
     *  from under the four-stat row. */
    focus: "50% 35%",
    /** Renders in the footer fine print. Set it if the licence asks for
     *  attribution; null for a photograph the company owns outright. */
    credit: null,
  } as null | {
    src: string;
    alt: string;
    focus: string;
    credit: string | null;
  },

  /**
   * The seat guarantee.
   *
   * The category's real fear is not losing $29, it is losing the one day the
   * visitor has at Moraine Lake. This is the promise that answers it, and it
   * is one neither Parks Canada nor Roam can structurally match. With
   * 20-minute headways the payout is rare; price it as marketing.
   */
  guarantee: {
    windowMinutes: 30,
  },

  /**
   * Whether seat counts come from real inventory.
   *
   * While false, every availability display degrades to a qualitative state
   * and no numeric "only N seats left" is rendered anywhere. Flip it when the
   * booking backend exists — not before. A scarcity claim you cannot
   * substantiate is a Competition Act s.74.01 exposure and, for a challenger
   * selling honesty, a worse trade than the urgency is worth.
   */
  inventoryIsLive: false as boolean,

  /** Competitor fares used for honest price comparison. Verify before launch
   *  and re-check each season — stale competitor pricing is a legal risk. */
  benchmarks: {
    parksCanadaMoraineRoundTrip: 8, // CAD, per person, reservation-only
    parksCanadaLakeLouiseRoundTrip: 8,
    roamRoute8XOneWay: 12.5,
    moraineLakeBusDaytime: 70,
    moraineLakeBusSunrise: 115,
    checkedOn: "2026-08-01",
  },
} as const;

export type Site = typeof site;
