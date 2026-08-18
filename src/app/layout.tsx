import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { site, isProductionDeploy } from "@/config/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyBookBar, type StickyDeparture } from "@/components/layout/sticky-book-bar";
import { getDepartures, routeBySlug, stopById } from "@/data/network";
import { todayISO } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/schema";

/**
 * Inter for the interface, Source Serif for headings.
 *
 * The serif is doing conversion work, not decoration: every established
 * transit authority we benchmarked uses one, and it is the cheapest available
 * signal that an operator has been around longer than one season.
 */
const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const display = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: `Scheduled shuttles to Moraine Lake and Lake Louise with departures every 15–30 minutes. Seats released daily, free guaranteed parking, open return times. ${site.season.label}.`,
  applicationName: site.name,
  keywords: [
    "Moraine Lake shuttle",
    "Lake Louise shuttle",
    "Parks Canada shuttle alternative",
    "Roam Transit alternative",
    "Banff to Lake Louise bus",
    "Moraine Lake sunrise shuttle",
    "Lake Louise lakeshore shuttle",
    "how to get to Moraine Lake",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: true, address: false, email: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      "Departures every 15–30 minutes to Moraine Lake and Lake Louise. Seats released daily — no reservation lottery.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description:
      "Departures every 15–30 minutes to Moraine Lake and Lake Louise. Seats released daily.",
  },
  /* Preview deployments must never be indexed — see `isProductionDeploy`. */
  robots: isProductionDeploy
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2f4e5d",
  colorScheme: "light",
};

/** Today's Moraine Lake departures, for the sticky bar. Computed on the
 *  server so the client bundle never has to carry the network dataset. */
function stickyDepartures(): StickyDeparture[] {
  const route = routeBySlug("moraine-lake-express");
  if (!route) return [];
  const destination = stopById(route.destinationId).shortName;
  return getDepartures(route, todayISO()).map((d) => ({
    time: d.time,
    label: d.label,
    minutes: d.minutes,
    destination,
    routeSlug: route.slug,
    fare: route.fares.adult,
  }));
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* `scroll-behavior: smooth` is set on html in globals.css. Next 16 stopped
         overriding it during navigation, so without this attribute every route
         transition animates a long smooth scroll to the top instead of jumping
         — most visibly on the home → /book handoff. */
    <html
      lang="en-CA"
      data-scroll-behavior="smooth"
      className={`${body.variable} ${display.variable}`}
    >
      <body className="min-h-screen bg-paper antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <StickyBookBar departures={stickyDepartures()} />
      </body>
    </html>
  );
}
