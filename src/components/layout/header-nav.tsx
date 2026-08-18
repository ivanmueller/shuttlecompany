"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { track, scrollDepth } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface NavRoute {
  id: string;
  number: string;
  slug: string;
  name: string;
}

const nav = [
  { href: "/routes", label: "Routes & schedules" },
  { href: "/moraine-lake-shuttle", label: "Moraine Lake" },
  { href: "/lake-louise-shuttle", label: "Lake Louise" },
  { href: "/fares", label: "Fares" },
  { href: "/faq", label: "FAQ" },
];

/**
 * Header navigation.
 *
 * Takes routes as props rather than importing `@/data/network`. Both this and
 * the sticky bar are client components, so importing the network module put
 * all 504 lines of stops, routes, fares and timetable rules into the client
 * bundle of every page on the site — including /terms and /privacy.
 */
export function HeaderNav({
  routes,
  tollFree,
  tollFreeDisplay,
}: {
  routes: NavRoute[];
  tollFree: string;
  tollFreeDisplay: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4 lg:gap-6">
          <Link href="/" aria-label="Home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors",
                        active
                          ? "bg-brand-50 text-brand-900"
                          : "text-ink-muted hover:bg-sunken hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${tollFree}`}
              className="hidden text-sm font-semibold text-ink-muted hover:text-ink xl:block"
            >
              {tollFreeDisplay}
            </a>
            {/* Shown at every breakpoint. This used to be `hidden
                sm:inline-flex`, so on a 390px phone — the device most of this
                traffic arrives on — the header carried no booking action at
                all, and the sticky bar that was meant to cover for it did not
                appear until 620px of scroll. */}
            <ButtonLink
              href="/book"
              size="md"
              className="px-3 sm:px-5"
              onClick={() =>
                track({ name: "cta_clicked", id: "header", scrollDepth: scrollDepth() })
              }
            >
              {/* No fare here. This button is site-wide, so any "from $X"
                  would be `Math.min()` across every route — the $12 lakeshore
                  fare — shown to someone on their way to a $29 Moraine Lake
                  seat. The fare belongs where the product is named. */}
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">Book a seat</span>
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-md border border-line text-ink lg:hidden"
            >
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-[calc(4.5rem+2.25rem)] z-40 overflow-y-auto border-t border-line bg-paper lg:hidden"
        >
          <nav aria-label="Mobile" className="container-page py-5">
            <ul className="flex flex-col divide-y divide-line">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex items-center justify-between py-4 text-lg font-semibold text-ink"
                  >
                    {item.label}
                    <svg viewBox="0 0 20 20" className="size-4 text-ink-subtle" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M7 4l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Every route
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {routes.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/routes/${r.slug}`}
                    onClick={close}
                    className="flex items-center gap-3 rounded-[var(--radius)] border border-line px-3 py-3"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-800 text-sm font-bold text-white tabular">
                      {r.number}
                    </span>
                    <span className="text-[0.9375rem] font-medium text-ink">{r.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <ButtonLink href="/book" size="lg" className="mt-6 w-full" onClick={close}>
              Book a seat
            </ButtonLink>
            <a
              href={`tel:${tollFree}`}
              className="mt-3 block py-3 text-center text-sm font-semibold text-ink-muted"
            >
              Call {tollFreeDisplay}
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
