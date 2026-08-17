"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/config/site";
import { routes } from "@/data/network";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/routes", label: "Routes & schedules" },
  { href: "/moraine-lake-shuttle", label: "Moraine Lake" },
  { href: "/lake-louise-shuttle", label: "Lake Louise" },
  { href: "/fares", label: "Fares" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock the background from scrolling behind the drawer.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Service banner. The single highest-trust element on a transit site:
          it says someone is awake and watching the network today. */}
      <div className="bg-brand-950 text-white">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-2 truncate">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-ontime" />
            <span className="truncate">
              <span className="font-semibold">All routes on schedule.</span>{" "}
              <span className="hidden text-white/70 sm:inline">
                Season {site.season.label}
              </span>
            </span>
          </p>
          <Link
            href="/service-status"
            className="hidden shrink-0 text-white/80 underline-offset-4 hover:text-white hover:underline sm:block"
          >
            Live service status
          </Link>
          <a
            href={`tel:${site.contact.tollFree}`}
            className="shrink-0 font-semibold text-white/90 hover:text-white sm:hidden"
          >
            Call us
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
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
              href={`tel:${site.contact.tollFree}`}
              className="hidden text-sm font-semibold text-ink-muted hover:text-ink xl:block"
            >
              {site.contact.tollFreeDisplay}
            </a>
            <ButtonLink href="/book" size="md" className="hidden sm:inline-flex">
              Book a seat
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
                {open ? (
                  <path d="M5 5l10 10M15 5L5 15" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" />
                )}
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
              href={`tel:${site.contact.tollFree}`}
              className="mt-3 block py-3 text-center text-sm font-semibold text-ink-muted"
            >
              Call {site.contact.tollFreeDisplay}
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
