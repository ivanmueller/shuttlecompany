"use client";

import { useState } from "react";
import { SearchWidget } from "@/components/booking/search-widget";
import { ButtonLink } from "@/components/ui/button";
import { planJourneys, stopById } from "@/data/network";
import { track, scrollDepth } from "@/lib/analytics";
import { cn, formatCad } from "@/lib/utils";

/**
 * The one question worth asking above the fold, and the proof underneath it.
 *
 * The old hero opened with four dropdowns — from, to, date, travellers —
 * before giving the visitor anything. That is the right pattern for
 * Trainline, whose users choose among thousands of origin–destination pairs.
 * It is the wrong pattern here: demand is concentrated on one destination,
 * from one of three places, on today or tomorrow. When the choice space is
 * that narrow a form is a toll booth in front of the information people came
 * for.
 *
 * So this asks the single question that actually routes someone — where are
 * you starting? — as three large buttons, answers it immediately with the
 * journey, the transfer if there is one and the fare, and then shows real
 * departures. The full search is still here, one tap away, for the minority
 * who need it.
 *
 * The layout is one grid rather than two copies of anything. On a phone it
 * reads intro → question → departures → action; from `lg` up the board moves
 * into its own column spanning the rows. Rendering the board twice and hiding
 * one with CSS would ship it twice, which is the exact fault the comparison
 * table used to have.
 */

const ORIGINS = [
  { id: "ll-village", label: "Lake Louise", sub: "village or lot" },
  { id: "banff-downtown", label: "Banff", sub: "no car needed" },
  { id: "canmore-downtown", label: "Canmore", sub: "via Banff" },
] as const;

const DESTINATION = "moraine-lake";

export function HeroPlanner({
  board,
  fare,
  headway,
  guaranteeMinutes,
}: {
  /** The live departure board. The only thing here that needs server data. */
  board: React.ReactNode;
  fare: string;
  headway: number;
  guaranteeMinutes: number;
}) {
  const [originId, setOriginId] = useState<string>(ORIGINS[0].id);
  const [open, setOpen] = useState(false);

  const journey = planJourneys(originId, DESTINATION)[0];
  const connecting = (journey?.legs.length ?? 1) > 1;

  const card =
    "rounded-[calc(var(--radius)+0.35rem)] bg-paper p-4 shadow-[0_2px_4px_rgb(22_24_28/0.08),0_24px_56px_-20px_rgb(22_24_28/0.5)] ring-1 ring-black/5 sm:p-5";

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-x-12 lg:gap-y-6">
      <div className="order-1 min-w-0 lg:col-start-1 lg:row-start-1">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <span aria-hidden className="size-1.5 rounded-full bg-ontime" />
          Parks Canada sold out? That&apos;s who we built this for
        </p>

        <h1 className="text-on-photo text-[2.1rem] font-bold leading-[1.05] text-white sm:text-5xl md:text-[3.25rem]">
          Seats to Moraine Lake today —{" "}
          <span className="text-accent-400">
            every {headway} minutes, {fare}
          </span>
        </h1>

        <p className="text-on-photo mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-white/90">
          A scheduled bus, not a tour. Seats released daily, free parking, and you
          come back on whichever bus you like.
        </p>
      </div>

      {/* The question. Compact on purpose: on a 390px phone this and the first
          departures both have to clear the fold. */}
      <div className={cn(card, "order-2 min-w-0 lg:col-start-1 lg:row-start-2")}>
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
          Where are you starting from?
        </p>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {ORIGINS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOriginId(o.id);
                track({ name: "origin_switched", to: o.id });
              }}
              aria-pressed={originId === o.id}
              className={cn(
                "rounded-[var(--radius)] border px-2 py-2.5 text-center transition-colors",
                originId === o.id
                  ? "border-brand-700 bg-brand-800 text-white"
                  : "border-line-strong bg-paper text-ink hover:border-brand-400",
              )}
            >
              <span className="block text-[0.9375rem] font-bold leading-tight">
                {o.label}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-[0.6875rem] leading-tight",
                  originId === o.id ? "text-white/75" : "text-ink-subtle",
                )}
              >
                {o.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Answer it immediately. From Banff and Canmore this is the two-leg
            journey the old form refused to sell at all — Moraine Lake simply
            vanished from the destination list once you picked either. */}
        {journey && (
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">
              {stopById(originId).shortName} → Moraine Lake
            </span>{" "}
            ·{" "}
            {connecting ? (
              <>
                Route {journey.legs[0].route.number}, change at{" "}
                {stopById(journey.viaStopId ?? "").shortName}, then Route{" "}
                {journey.legs[1].route.number} — about {journey.totalMinutes} min
              </>
            ) : (
              <>
                Route {journey.legs[0].route.number} direct — {journey.totalMinutes} min
              </>
            )}
            {" · "}
            <span className="font-semibold text-ink">
              {formatCad(journey.adultFare)}
            </span>{" "}
            per adult{connecting ? ", both legs booked together" : ""}. Under 6 free.
          </p>
        )}
      </div>

      {/* The proof. One node, placed by the grid. */}
      <div className="order-3 min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:pt-1">
        {board}
      </div>

      <div className="order-4 min-w-0 lg:col-start-1 lg:row-start-3">
        <div className={card}>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <ButtonLink
              href={`/book?from=${originId}&to=${DESTINATION}`}
              size="lg"
              className="w-full"
              onClick={() =>
                track({
                  name: "cta_clicked",
                  id: "hero-primary",
                  scrollDepth: scrollDepth(),
                })
              }
            >
              See every departure
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="hero-full-search"
              className="h-13 rounded-[var(--radius)] border border-line-strong px-5 text-[0.9375rem] font-semibold text-ink-muted transition-colors hover:border-brand-400 hover:text-ink"
            >
              {open ? "Hide options" : "Different route or date?"}
            </button>
          </div>

          {open && (
            <div id="hero-full-search" className="mt-4 border-t border-line pt-4">
              {/* Keyed so switching origin above re-seeds the form rather than
                  leaving it out of sync with the buttons. */}
              <SearchWidget
                key={originId}
                tone="flat"
                origin={originId}
                destination={DESTINATION}
              />
            </div>
          )}
        </div>

        {/* The category's real fear is not losing $29, it is losing the one
            day they have at Moraine Lake — and this is a promise neither Parks
            Canada nor Roam can structurally match. It sits under the booking
            action rather than above the board, because availability is what
            the visitor checks first. */}
        <p className="text-on-photo mt-4 flex max-w-xl items-start gap-2 text-sm leading-relaxed text-white/85">
          <svg viewBox="0 0 20 20" aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-400" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2.5l6 2.5v4.5c0 3.6-2.5 6.6-6 8-3.5-1.4-6-4.4-6-8V5l6-2.5Z" />
            <path d="M7.5 10l1.8 1.8L13 8" />
          </svg>
          <span>
            <strong className="font-semibold text-white">Seat guarantee:</strong> if we
            can&apos;t get you on a bus within {guaranteeMinutes} minutes of your booked
            departure, you travel free and we refund the fare.
          </span>
        </p>
      </div>
    </div>
  );
}
