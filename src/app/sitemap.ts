import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { routes } from "@/data/network";
import { landingPages } from "@/data/landing-pages";

/**
 * Sitemap.
 *
 * Priorities are set by commercial value rather than depth: the keyword
 * landing pages outrank the legal pages because that is where the traffic and
 * the revenue are. Change frequency on the route pages is daily because their
 * timetables and availability genuinely change daily.
 *
 * The booking funnel is excluded — its query strings would generate thousands
 * of near-duplicate URLs and it is noindex anyway.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = ([
    { url: "/", priority: 1, changeFrequency: "daily" },
    { url: "/routes", priority: 0.9, changeFrequency: "daily" },
    { url: "/fares", priority: 0.8, changeFrequency: "monthly" },
    { url: "/faq", priority: 0.8, changeFrequency: "monthly" },
    { url: "/stops", priority: 0.7, changeFrequency: "monthly" },
    { url: "/service-status", priority: 0.6, changeFrequency: "hourly" },
    { url: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { url: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { url: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { url: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
  ] as const).map((entry) => ({
    ...entry,
    url: new URL(entry.url, site.url).toString(),
    lastModified: now,
  }));

  const routePages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: new URL(`/routes/${route.slug}`, site.url).toString(),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const keywordPages: MetadataRoute.Sitemap = landingPages.map((page) => ({
    url: new URL(`/${page.slug}`, site.url).toString(),
    lastModified: new Date(page.updated),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticPages, ...routePages, ...keywordPages];
}
