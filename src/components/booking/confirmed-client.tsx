"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { routes, stopById, formatMinutesLabel } from "@/data/network";
import { ButtonLink } from "@/components/ui/button";
import { formatDateLong } from "@/lib/utils";
import { site } from "@/config/site";

/**
 * Confirmation.
 *
 * The most under-used screen in this category. Every competitor treats it as a
 * receipt; it is actually the highest-attention moment the business ever gets
 * with a customer, and it is where the two things that cost the most money get
 * prevented:
 *
 *  1. No-shows and missed buses — hence the pre-departure checklist, with the
 *     no-cell-service warning stated before they leave the hotel rather than
 *     buried in an FAQ.
 *  2. Under-booking — the second lake is one tap away while intent is highest.
 *
 * The booking reference is derived from the trip parameters so it is stable on
 * reload. Replace with the real reference from the payment provider.
 */
export function ConfirmedClient() {
  const params = useSearchParams();
  const route = routes.find((r) => r.slug === params.get("route"));
  const date = params.get("date") ?? "";
  const time = params.get("time") ?? "";
  const email = params.get("email") ?? "";

  if (!route || !date || !time) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-ink-muted">
          We could not find that booking.{" "}
          <Link href="/book" className="font-semibold text-brand-700 underline">
            Start again
          </Link>
          .
        </p>
      </div>
    );
  }

  const minutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  const origin = stopById(route.originId);
  const reference = `LL-${route.number}${date.replace(/-/g, "").slice(4)}-${time.replace(":", "")}`;

  const otherLake = route.slug.includes("moraine")
    ? routes.find((r) => r.slug === "lake-louise-lakeshore-shuttle")
    : routes.find((r) => r.slug === "moraine-lake-express");

  return (
    <div className="container-page py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[calc(var(--radius)+0.2rem)] border border-ontime/25 bg-ontime-bg p-6">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-full bg-ontime text-white"
            >
              <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10.5 8 14.5 16 6" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold text-ontime-ink">
                Confirmed — reference {reference}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ontime-ink">
                {email ? (
                  <>
                    Your ticket is on its way to <strong>{email}</strong>.
                  </>
                ) : (
                  "Your ticket is on its way by email."
                )}{" "}
                It usually lands within a minute — check spam if it does not.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[calc(var(--radius)+0.2rem)] border border-line">
          <div className="flex items-center gap-3 border-b border-line bg-brand-900 px-5 py-4 text-white">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-[var(--radius)] bg-white/15 font-display text-base font-bold tabular"
            >
              {route.number}
            </span>
            <div>
              <p className="font-sans text-[0.9375rem] font-bold">{route.name}</p>
              <p className="text-xs text-white/65">
                {origin.shortName} → {stopById(route.destinationId).shortName}
              </p>
            </div>
          </div>

          <dl className="divide-y divide-line text-sm">
            {[
              ["Date", formatDateLong(date)],
              ["Departs", formatMinutesLabel(minutes)],
              ["Arrives", formatMinutesLabel(minutes + route.durationMinutes)],
              [
                "Return",
                route.tripType === "round-trip"
                  ? "Open — board any bus with a free seat"
                  : "One way",
              ],
              ["Board at", origin.boarding],
              ["Parking", origin.parkingNote ?? "See the stop page"],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[9rem_1fr]">
                <dt className="text-ink-subtle">{label}</dt>
                <dd className="font-medium leading-relaxed text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 rounded-[var(--radius)] border border-delay/25 bg-delay-bg p-5">
          <h2 className="font-display text-lg font-bold text-delay-ink">
            Before you leave for the bus
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-delay-ink">
            {[
              "Screenshot your ticket. There is no cell service at Moraine Lake and none for the first few kilometres of the road out.",
              "Arrive 15 minutes early. On peak days the walk from the far end of the lot to the bays takes close to 10.",
              "Bring your Parks Canada park pass. It is separate from this ticket and the gate queue can be long.",
              "Dress a layer warmer than you think. It is routinely 10°C colder at the lake than in the village, and colder again before dawn.",
            ].map((line) => (
              <li key={line} className="flex gap-2.5">
                <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-delay" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {otherLake && (
          <div className="mt-6 rounded-[var(--radius)] border border-line p-5">
            <h2 className="font-display text-lg font-bold text-ink">
              Doing the other lake too?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {route.slug.includes("moraine")
                ? "Most visitors pair Moraine Lake in the morning with the Lake Louise lakeshore in the afternoon, once the parking queue has become someone else's problem."
                : "Moraine Lake is a 35-minute ride from the same hub, and it is the one you cannot drive to."}
            </p>
            <ButtonLink
              href={`/book?route=${otherLake.slug}&date=${date}`}
              variant="outline"
              size="md"
              className="mt-4"
            >
              Add Route {otherLake.number} on the same day
            </ButtonLink>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm">
          <p className="text-ink-muted">
            Need to change something?{" "}
            <a
              href={`tel:${site.contact.tollFree}`}
              className="font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              {site.contact.tollFreeDisplay}
            </a>{" "}
            or use the link in your email — free up to 2 hours before departure.
          </p>
          <Link
            href="/"
            className="font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
