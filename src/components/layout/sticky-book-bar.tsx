"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/data/network";
import { formatCad } from "@/lib/utils";

/**
 * Persistent mobile CTA.
 *
 * On phones the header CTA scrolls away and never comes back, which is where
 * most mobile bookings are lost. This re-enters after the hero and stays.
 *
 * It is suppressed on the booking funnel itself, where a second competing
 * call to action costs conversions rather than earning them.
 */
export function StickyBookBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const suppressed = pathname.startsWith("/book");
  const cheapest = Math.min(...routes.map((r) => r.fares.adult));

  if (suppressed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur transition-transform duration-200 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container-page flex items-center gap-3 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8125rem] font-semibold text-ink">
            Seats today from {formatCad(cheapest)}
          </p>
          <p className="flex items-center gap-1.5 truncate text-xs text-ink-muted">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-ontime" />
            Departures every 15–30 min
          </p>
        </div>
        <ButtonLink
          href="/book"
          size="md"
          tabIndex={visible ? undefined : -1}
          className="shrink-0"
        >
          Book now
        </ButtonLink>
      </div>
    </div>
  );
}
