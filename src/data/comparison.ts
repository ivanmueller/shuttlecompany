import { site } from "@/config/site";

/**
 * Head-to-head comparison data.
 *
 * Comparative advertising is legal in Canada and it converts extremely well
 * for a challenger, but every claim has to be true, current and substantiable
 * — s.52 of the Competition Act applies to a comparison table exactly as it
 * applies to a headline price.
 *
 * So the rules this table follows:
 *  1. Never claim a competitor is worse where they are better. Parks Canada is
 *     genuinely cheaper; the table says so plainly.
 *  2. Describe mechanisms, not motives. "Reservation-only, released in windows"
 *     is a fact. "Impossible to book" is an opinion that invites a complaint.
 *  3. Carry a visible verification date and re-check it every season.
 */

export type Verdict = "us" | "them" | "even";

export interface ComparisonRow {
  criterion: string;
  /** What matters to the rider — shown as a sub-line, drives the SEO long tail. */
  detail?: string;
  ours: string;
  parksCanada: string;
  roam: string;
  moraineLakeBus: string;
  verdict: Verdict;
}

export const comparisonRows: ComparisonRow[] = [
  {
    criterion: "How you get a seat",
    detail: "The single biggest reason visitors miss the lakes entirely.",
    ours: "Book any time — seats released daily, including same day",
    parksCanada: "Reservation-only, released in scheduled seasonal windows",
    roam: "Reservation-only for the Lake Louise express",
    moraineLakeBus: "Book online in advance",
    verdict: "us",
  },
  {
    criterion: "Frequency to Moraine Lake",
    detail: "How long you wait if you miss one.",
    ours: "Every 20 minutes, 6:00 am – 7:20 pm",
    parksCanada: "Fixed reserved departure slots",
    roam: "Does not serve Moraine Lake",
    moraineLakeBus: "Roughly every 30 minutes",
    verdict: "us",
  },
  {
    criterion: "Adult fare to Moraine Lake",
    detail: "Round trip, per adult, before the park pass.",
    ours: "$29",
    parksCanada: `$${site.benchmarks.parksCanadaMoraineRoundTrip} — the cheapest option if you can get a seat`,
    roam: "Not offered",
    moraineLakeBus: `$${site.benchmarks.moraineLakeBusDaytime}`,
    verdict: "them",
  },
  {
    criterion: "Choosing your return time",
    detail: "Whether a slow hike or a long lunch costs you your ride home.",
    ours: "Open return — any bus with a seat",
    parksCanada: "Return slot assigned at booking",
    roam: "Fixed reserved departure",
    moraineLakeBus: "Choose your return at booking",
    verdict: "us",
  },
  {
    criterion: "Parking",
    ours: "Free, reserved, included with the fare",
    parksCanada: "Free at the Park & Ride, subject to space",
    roam: "Street or municipal parking at your own cost",
    moraineLakeBus: "Free, included",
    verdict: "even",
  },
  {
    criterion: "Sunrise service",
    detail: "The Ten Peaks at first light is the reason most people come.",
    ours: "Yes — pre-dawn departures every 25 minutes",
    parksCanada: "No pre-dawn service",
    roam: "No pre-dawn service",
    moraineLakeBus: `Yes, from $${site.benchmarks.moraineLakeBusSunrise}`,
    verdict: "us",
  },
  {
    criterion: "Changes and cancellations",
    ours: "Free changes to 2 hours out; refund to 24 hours out",
    parksCanada: "Cancellation policy set by the reservation system",
    roam: "Changes subject to availability, often not possible",
    moraineLakeBus: "Reschedule to 24 hours out; tickets non-refundable",
    verdict: "us",
  },
  {
    criterion: "Pickup in Banff or Canmore",
    ours: "Yes — every 30 minutes from Banff, hourly from Canmore",
    parksCanada: "Park & Ride at Lake Louise only",
    roam: "Yes — this is Roam's core strength",
    moraineLakeBus: "No Banff or Canmore pickup",
    verdict: "even",
  },
];

export const comparisonColumns = [
  { key: "ours" as const, label: site.name, us: true },
  { key: "parksCanada" as const, label: "Parks Canada", us: false },
  { key: "roam" as const, label: "Roam Transit", us: false },
  { key: "moraineLakeBus" as const, label: "Moraine Lake Bus Co.", us: false },
];
