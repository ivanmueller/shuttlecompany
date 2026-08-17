/**
 * Single source of truth for brand-swappable identity.
 *
 * Everything here is a placeholder chosen to be plausible and internally
 * consistent — replace with the real operating details before launch.
 * Nothing in the codebase hard-codes these strings.
 */

export const site = {
  /** Placeholder name. "Larch Line" references Larch Valley above Moraine Lake:
   *  local, ownable, and not confusable with Roam or Moraine Lake Bus Company. */
  name: "Larch Line",
  legalName: "Larch Line Transit Ltd.",
  tagline: "Frequent shuttles to Moraine Lake & Lake Louise",

  /** Used for canonical URLs, sitemap, and JSON-LD. Override with
   *  NEXT_PUBLIC_SITE_URL in the deployment environment. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://larchline.ca",

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
