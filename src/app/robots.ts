import type { MetadataRoute } from "next";
import { site, isProductionDeploy } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  /* Preview deployments get a blanket disallow to match their noindex tag.
     Belt and braces: the meta tag stops indexing, this stops crawling. */
  if (!isProductionDeploy) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

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
