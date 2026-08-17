import { site } from "@/config/site";

/**
 * Legal page content.
 *
 * PLACEHOLDER — these are structured drafts, not legal advice, and they must
 * be reviewed by a lawyer before the site takes a single real payment. The
 * terms of carriage in particular carry genuine liability exposure for a
 * passenger carrier operating in a national park.
 *
 * Specific gaps to close with counsel: limitation of liability, the insurance
 * position, Alberta's Consumer Protection Act obligations on refunds, PIPEDA
 * compliance for the privacy notice, and the accessibility commitments that
 * follow from the Accessible Canada Act if any federal route is added.
 */

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export const legalPages: Record<
  string,
  { title: string; updated: string; intro: string; sections: LegalSection[] }
> = {
  terms: {
    title: "Terms & conditions of carriage",
    updated: "2026-08-01",
    intro: `These terms govern travel on services operated by ${site.legalName}. Booking a seat means accepting them.`,
    sections: [
      {
        heading: "Your ticket",
        paragraphs: [
          "A ticket entitles the named passenger to one seat on the booked departure, and — on round-trip routes — to a return on any service that day with an available seat. Tickets are not transferable to another person and have no cash value.",
          "Present your ticket on a phone screen or on paper when boarding. We recommend a screenshot: there is no cell service at Moraine Lake.",
        ],
      },
      {
        heading: "Changes, cancellations and refunds",
        paragraphs: [
          "More than 24 hours before departure: change free of charge, or cancel for a full refund to the original payment method.",
          "Between 24 and 2 hours before departure: changes are free; cancellations receive a credit valid for the remainder of the current operating season.",
          "Less than 2 hours before departure: no changes or refunds. Seats are limited and could have been sold to another traveller.",
          "If we cancel a departure for any reason, you receive a full refund automatically, and we will offer the next available seat if you still wish to travel.",
        ],
      },
      {
        heading: "Punctuality",
        paragraphs: [
          "Services depart at the scheduled time. Please arrive at least 15 minutes before departure; at busy stops the walk from parking to the boarding bays can take close to 10 minutes.",
          "If you miss your departure, present yourself at the kiosk and we will accommodate you on the next service with an available seat at no additional charge, subject to space.",
        ],
      },
      {
        heading: "Conduct and baggage",
        paragraphs: [
          "Day packs, camera equipment, strollers, walkers, climbing gear and inflatable watercraft are carried free of charge. Rigid canoes and kayaks cannot be accommodated.",
          "Drivers may refuse carriage to any passenger whose conduct presents a risk to the safety of others, or who is impaired to the point of being unable to travel safely. No refund is given in these circumstances.",
        ],
      },
      {
        heading: "Circumstances beyond our control",
        paragraphs: [
          "Services may be delayed, diverted or cancelled because of weather, wildfire, wildlife activity, road closures ordered by Parks Canada or Alberta Transportation, or mechanical failure. We refund cancelled services in full.",
          "We are not liable for consequential losses arising from a delayed or cancelled service, including missed connections, accommodation or tour bookings with third parties.",
        ],
      },
      {
        heading: "Park passes",
        paragraphs: [
          "A valid Parks Canada park pass is required for every visitor to Banff National Park and is not included in any fare. Obtaining one is the passenger's responsibility.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy policy",
    updated: "2026-08-01",
    intro: `How ${site.legalName} handles your personal information, under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and Alberta's Personal Information Protection Act.`,
    sections: [
      {
        heading: "What we collect",
        paragraphs: [
          "To sell you a seat we collect your name, email address, travel date and party composition. If you tell us about an accessibility requirement, we record it so the space is held.",
          "Payment card details are handled entirely by our payment processor and never reach our servers or our staff.",
          "We collect basic analytics about how the site is used — pages viewed, approximate region, device type — in aggregate form.",
        ],
      },
      {
        heading: "What we do with it",
        paragraphs: [
          "We use your details to issue your ticket, to contact you if your service is delayed or cancelled, and to process refunds. That is the whole list.",
          "We do not sell personal information. We do not share it with other operators, tour companies or accommodation providers.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "Booking records are retained for seven years to meet tax and insurance obligations. Marketing contact details are deleted on request, immediately and without argument.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          `You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email ${site.contact.email} and we will respond within 30 days as PIPEDA requires.`,
        ],
      },
    ],
  },

  accessibility: {
    title: "Accessibility",
    updated: "2026-08-01",
    intro:
      "Our commitment to accessible travel, on the buses and on this website.",
    sections: [
      {
        heading: "On our vehicles",
        paragraphs: [
          "Every vehicle in the fleet is wheelchair accessible with a ramp and two securement positions. There is no charge for an accessible space and no charge for a support person travelling with you.",
          "Select the accessible seating option when booking so we can hold the position, or call us and we will arrange it. Certified service animals travel free at any size and do not need a carrier.",
        ],
      },
      {
        heading: "At our stops",
        paragraphs: [
          "The Lake Louise Village Transit Hub and the Gondola Park & Ride both have step-free routes from designated accessible parking to the boarding bays. Accessible parking spaces are reserved and included with your fare.",
          "Moraine Lake's day-use bus loop is step-free to the lakeshore path. The Rockpile viewpoint involves stairs and uneven ground and is not wheelchair accessible; this is a Parks Canada trail, not ours.",
        ],
      },
      {
        heading: "On this website",
        paragraphs: [
          "This site targets WCAG 2.2 Level AA. Every interactive element is keyboard reachable with a visible focus indicator, colour is never the only way information is conveyed, and timetables are marked up as real data tables for screen readers.",
          `If something here does not work for you, tell us at ${site.contact.email} and we will fix it. Please describe what you were trying to do and what assistive technology you were using.`,
        ],
      },
    ],
  },
};
