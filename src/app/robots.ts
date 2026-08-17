import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* The booking funnel produces unbounded query-string permutations.
           Crawling it wastes budget that should go to the route and keyword
           pages, and indexes nothing anyone would ever search for. */
        disallow: ["/book", "/book/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
