import { site } from "@/config/site";
import { todayISO } from "@/lib/utils";

/**
 * Season bounds for every date control on the site.
 *
 * The booking form used to accept any date up to a year out, which meant a
 * visitor could pick a February departure on a service that stops running on
 * 13 October. A date picker that offers dates you cannot sell is a promise
 * you break at the moment of payment.
 */
export const seasonStart = site.season.startISO;
export const seasonEnd = site.season.endISO;

export const isWithinSeason = (iso: string): boolean =>
  iso >= seasonStart && iso <= seasonEnd;

/** The first date that can actually be booked from today. */
export const firstBookableDate = (from = todayISO()): string =>
  from < seasonStart ? seasonStart : from;

/** Clamped [min, max] for a native date input. */
export const bookableRange = (from = todayISO()): { min: string; max: string } => ({
  min: firstBookableDate(from),
  max: seasonEnd,
});

/** True when today falls outside the operating window entirely. */
export const isOffSeason = (from = todayISO()): boolean => !isWithinSeason(from);
