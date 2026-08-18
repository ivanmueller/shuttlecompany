import Link from "next/link";
import { HeaderNav, type NavRoute } from "@/components/layout/header-nav";
import { networkStatus, lakeBoundRoutes, routes } from "@/data/network";
import { site } from "@/config/site";

/**
 * Service banner + header.
 *
 * The banner is the single highest-trust element on a transit site — but only
 * if it can report bad news. It used to hard-code "All routes on schedule"
 * while Route 5 shipped with `status: "delay"`, so the banner contradicted
 * the amber pill on a route card about a thousand pixels below it. A display
 * that always says everything is fine is decoration; one that occasionally
 * names a problem is why riders trust departure boards at all.
 *
 * Server component: the route list is passed to the client nav as props so
 * the network module stays out of every page's client bundle.
 */
export function SiteHeader() {
  /* Scoped to the lake-bound services. This used to read the whole network,
     so a delay on the Canmore hourly took the first line of every page —
     above the logo — from the ~90% of visitors here for Moraine Lake. The
     affected route still shows its amber pill on its own card and page. */
  const { status, affected } = networkStatus(lakeBoundRoutes());
  const navRoutes: NavRoute[] = routes.map((r) => ({
    id: r.id,
    number: r.number,
    slug: r.slug,
    name: r.name,
  }));

  const dot =
    status === "ontime" ? "bg-ontime" : status === "delay" ? "bg-delay" : "bg-issue";

  const headline =
    status === "ontime"
      ? "All routes on schedule."
      : affected.length === 1
        ? `Route ${affected[0].number}: ${affected[0].statusNote ?? "minor delay"}`
        : `${affected.length} routes reporting delays.`;

  return (
    /* Fragment, not a wrapper: `position: sticky` is constrained to its
       parent's box, so nesting the header inside a banner div would stop it
       sticking the moment the banner scrolled away. */
    <>
      <section aria-label="Service status" className="on-dark bg-brand-950 text-white">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-xs">
          <p className="flex min-w-0 items-center gap-2">
            <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${dot}`} />
            <span className="truncate">
              <span className="font-semibold">{headline}</span>{" "}
              <span className="hidden text-white/75 sm:inline">
                Season {site.season.label}
              </span>
            </span>
          </p>
          <Link
            href="/service-status"
            className="-my-1 shrink-0 py-1 text-white/85 underline-offset-4 hover:text-white hover:underline"
          >
            <span className="hidden sm:inline">Live service status</span>
            <span className="sm:hidden">Status</span>
          </Link>
        </div>
      </section>
      <HeaderNav
        routes={navRoutes}
        tollFree={site.contact.tollFree}
        tollFreeDisplay={site.contact.tollFreeDisplay}
      />
    </>
  );
}
