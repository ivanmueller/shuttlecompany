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
   * Social proof. These are placeholders — replace with real, verifiable
   * numbers before launch. Do not publish a rating you cannot substantiate;
   * fabricated review counts in JSON-LD are a manual-action risk in Search
   * and a consumer-protection risk in Canada.
   */
  proof: {
    ratingValue: 4.9,
    reviewCount: 1284,
    passengersServed: "120,000+",
    onTimeRate: "98.6%",
    verified: false as const,
  },

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
