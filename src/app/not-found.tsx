import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/data/network";

/**
 * 404.
 *
 * Treated as a routing problem rather than an apology. Someone who mistyped a
 * URL or followed a stale link from a forum post is still a visitor who wants
 * a seat, so the page's job is to get them to one in a single click.
 */
export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
        404
      </p>
      <h1 className="mt-3 max-w-lg text-3xl font-bold text-ink md:text-4xl">
        This stop isn&apos;t on our network
      </h1>
      <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-ink-muted">
        The page you were after has moved or never existed. The timetables below are
        where most people are heading.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/book" size="lg">
          Find a departure
        </ButtonLink>
        <ButtonLink href="/routes" variant="outline" size="lg">
          All routes
        </ButtonLink>
      </div>

      <ul className="mt-12 flex flex-wrap justify-center gap-2">
        {routes.map((route) => (
          <li key={route.id}>
            <Link
              href={`/routes/${route.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-brand-400 hover:text-brand-700"
            >
              <span
                aria-hidden
                className="grid size-5 place-items-center rounded bg-brand-800 text-[0.625rem] font-bold text-white tabular"
              >
                {route.number}
              </span>
              {route.shortName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
