/**
 * JSON-LD generators.
 *
 * Structured data is the highest-leverage SEO work available to a transit
 * operator: BusTrip and Offer markup is what gets a fare and a departure time
 * rendered directly in the SERP, and FAQPage is what wins the People Also Ask
 * box on the queries this business is built around.
 *
 * Every generator returns a plain object. Nothing here reads from the DOM, so
 * it all runs at build time.
 */

import { site } from "@/config/site";
import {
  routes,
  stopById,
  formatMinutes,
  dailyDepartureCount,
  headwayLabel,
  type Route,
} from "@/data/network";
import { faqs, type Faq } from "@/data/faqs";

const abs = (path: string) => new URL(path, site.url).toString();

const postalAddress = () => ({
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
});

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "TouristInformationCenter",
  "@id": abs("/#organization"),
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  description: `Scheduled shuttle bus service to Moraine Lake and Lake Louise in Banff National Park. ${headwayLabel(routes[0])} on the Moraine Lake Express.`,
  address: postalAddress(),
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  telephone: site.contact.phone,
  email: site.contact.email,
  areaServed: [
    { "@type": "Place", name: "Banff National Park" },
    { "@type": "Place", name: "Lake Louise, Alberta" },
    { "@type": "Place", name: "Moraine Lake, Alberta" },
    { "@type": "Place", name: "Banff, Alberta" },
    { "@type": "Place", name: "Canmore, Alberta" },
  ],
  sameAs: [site.social.instagram, site.social.facebook],
  /**
   * AggregateRating is deliberately omitted until `site.proof.verified` is
   * true. Publishing a rating you cannot substantiate is a manual-action risk
   * in Google Search and a misleading-advertising risk under the Competition
   * Act. Flip the flag once the reviews are real and syndicated.
   */
  ...(site.proof.verified
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: site.proof.ratingValue,
          reviewCount: site.proof.reviewCount,
        },
      }
    : {}),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: site.url,
  name: site.name,
  publisher: { "@id": abs("/#organization") },
  inLanguage: "en-CA",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: abs("/book?route={search_term_string}"),
    },
    "query-input": "required name=search_term_string",
  },
});

/**
 * BusTrip + Offer for a single route.
 *
 * We emit the first departure of the day as the representative trip and
 * describe the frequency in the name, which is what Google's transit
 * guidelines ask for when a route runs on a headway rather than a fixed
 * published timetable.
 */
export const busTripSchema = (route: Route) => {
  const origin = stopById(route.originId);
  const destination = stopById(route.destinationId);

  return {
    "@context": "https://schema.org",
    "@type": "BusTrip",
    "@id": abs(`/routes/${route.slug}#trip`),
    name: `${route.name} — Route ${route.number}`,
    description: route.summary,
    provider: { "@id": abs("/#organization") },
    busName: `Route ${route.number}`,
    busNumber: route.number,
    departureBusStop: {
      "@type": "BusStop",
      name: origin.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: origin.locality,
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: origin.coords.lat,
        longitude: origin.coords.lng,
      },
    },
    arrivalBusStop: {
      "@type": "BusStop",
      name: destination.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: destination.locality,
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: destination.coords.lat,
        longitude: destination.coords.lng,
      },
    },
    departureTime: `${site.season.startISO}T${formatMinutes(route.firstDeparture)}:00-06:00`,
    arrivalTime: `${site.season.startISO}T${formatMinutes(
      route.firstDeparture + route.durationMinutes,
    )}:00-06:00`,
    offers: {
      "@type": "Offer",
      "@id": abs(`/routes/${route.slug}#offer`),
      url: abs(`/book?route=${route.slug}`),
      price: route.fares.adult,
      priceCurrency: "CAD",
      availability:
        route.status === "issue"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      validFrom: site.season.startISO,
      priceValidUntil: site.season.endISO,
      category: route.tripType === "round-trip" ? "Round trip" : "One way",
    },
  };
};

export const faqSchema = (items: Faq[] = faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

/** Route index page — helps Google understand the network as a set. */
export const routeListSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${site.name} routes`,
  numberOfItems: routes.length,
  itemListElement: routes.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `Route ${r.number} — ${r.name}`,
    description: `${headwayLabel(r)}. ${dailyDepartureCount(r)} departures daily.`,
    url: abs(`/routes/${r.slug}`),
  })),
});

/** For the keyword landing pages, which are informational rather than a product. */
export const articleSchema = (opts: {
  headline: string;
  description: string;
  path: string;
  updatedISO: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: opts.headline,
  description: opts.description,
  url: abs(opts.path),
  dateModified: opts.updatedISO,
  datePublished: opts.updatedISO,
  author: { "@id": abs("/#organization") },
  publisher: { "@id": abs("/#organization") },
  inLanguage: "en-CA",
});
