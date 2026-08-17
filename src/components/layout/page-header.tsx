import Link from "next/link";

/**
 * Interior page header.
 *
 * Carries the breadcrumb trail, which does double duty: orientation for the
 * visitor and a crawl signal that keeps every page within two clicks of the
 * home page.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  breadcrumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line bg-sunken">
      <div className="container-page py-10 md:py-14">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-subtle">
              <li>
                <Link href="/" className="hover:text-brand-700 hover:underline">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  <span aria-hidden>/</span>
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-ink-muted" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.path} className="hover:text-brand-700 hover:underline">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-[2.125rem] font-bold leading-[1.1] text-ink md:text-[2.75rem]">
          {title}
        </h1>
        {lede && (
          <div className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-muted">
            {lede}
          </div>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </header>
  );
}
