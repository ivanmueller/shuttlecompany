"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { routes, stopById, formatMinutesLabel } from "@/data/network";
import { Button } from "@/components/ui/button";
import { formatCad, formatDateLong, cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { site } from "@/config/site";

/**
 * Traveller details and payment.
 *
 * PAYMENT IS NOT WIRED UP. `submit` simulates a successful authorisation and
 * routes to the confirmation screen so the whole funnel can be walked and
 * tested end to end.
 *
 * To make it real, replace `submit` with a call to a server action that
 * creates a Stripe PaymentIntent, and mount Stripe Elements in place of the
 * card fieldset below. Card details must never touch this component's state —
 * the fields here are inert placeholders and deliberately not named like real
 * card inputs, so nothing is captured or submitted anywhere.
 *
 * Checkout form rules being followed:
 *  - One column. Multi-column checkouts test worse on mobile without
 *    exception.
 *  - Email is the only required contact field. A phone number requirement at
 *    this step is a measurable drop-off for international visitors.
 *  - The order summary stays visible; collapsing it on mobile hides the thing
 *    the rider is about to pay for.
 */

const PAX_KEYS = ["adult", "senior", "youth", "child"] as const;
const PAX_LABEL: Record<(typeof PAX_KEYS)[number], string> = {
  adult: "Adult",
  senior: "Senior",
  youth: "Youth",
  child: "Child",
};

export function CheckoutClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [accessible, setAccessible] = useState(false);

  const route = routes.find((r) => r.slug === params.get("route"));
  const date = params.get("date") ?? "";
  const time = params.get("time") ?? "";

  const pax = useMemo(() => {
    const out = {} as Record<(typeof PAX_KEYS)[number], number>;
    for (const k of PAX_KEYS) out[k] = Math.max(0, Number(params.get(k) ?? 0));
    if (PAX_KEYS.every((k) => out[k] === 0)) out.adult = 1;
    return out;
  }, [params]);

  const total = useMemo(
    () => (route ? PAX_KEYS.reduce((s, k) => s + pax[k] * route.fares[k], 0) : 0),
    [route, pax],
  );

  if (!route || !date || !time) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-[var(--radius)] border border-delay/25 bg-delay-bg p-6 text-center">
          <h2 className="font-display text-xl font-bold text-delay-ink">
            We lost track of your departure
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-delay-ink">
            Nothing has been charged. Pick a time again and you will be back here in a
            few seconds.
          </p>
          <Link
            href="/book"
            className="mt-5 inline-flex h-11 items-center rounded-[var(--radius)] bg-brand-800 px-5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Back to departures
          </Link>
        </div>
      </div>
    );
  }

  const departureMinutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    /* Funnel shape only. `booking_confirmed` must be emitted server-side from
       the payment webhook — client-side revenue events are wrong by 10–30%
       from blockers alone. */
    track({ name: "payment_submitted", route: route.slug, fareTotal: total });
    /* Stand-in for the payment call. See the note at the top of this file. */
    const qs = new URLSearchParams({ route: route.slug, date, time, email });
    setTimeout(() => router.push(`/book/confirmed?${qs.toString()}`), 700);
  };

  const fieldClasses =
    "h-11 w-full rounded-[var(--radius)] border border-line-strong bg-paper px-3 text-base text-ink placeholder:text-ink-subtle hover:border-brand-400 focus:border-brand-600";
  const labelClasses = "mb-1.5 block text-sm font-semibold text-ink";

  return (
    <div className="container-page py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <form onSubmit={submit} className="max-w-xl">
          <fieldset className="border-b border-line pb-8">
            <legend className="font-display text-xl font-bold text-ink">
              Who is travelling?
            </legend>
            <p className="mt-1.5 text-sm text-ink-muted">
              One name for the booking is enough — we do not need every passenger.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="ck-name" className={labelClasses}>
                  Full name
                </label>
                <input
                  id="ck-name"
                  name="name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClasses}
                  placeholder="Alex Bergeron"
                />
              </div>
              <div>
                <label htmlFor="ck-email" className={labelClasses}>
                  Email
                </label>
                <input
                  id="ck-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClasses}
                  placeholder="you@example.com"
                />
                <p className="mt-1.5 text-xs text-ink-muted">
                  Your ticket and a map to your boarding bay go here. Screenshot it —
                  there is no cell service at Moraine Lake.
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-line p-3.5 hover:border-brand-400">
                <input
                  type="checkbox"
                  checked={accessible}
                  onChange={(e) => setAccessible(e.target.checked)}
                  className="mt-0.5 size-4 accent-[var(--brand-700)]"
                />
                <span className="text-sm">
                  <span className="block font-medium text-ink">
                    I need a wheelchair securement position
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    Free, and we hold the space. Every vehicle in the fleet is ramp
                    equipped.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset className="border-b border-line py-8">
            <legend className="font-display text-xl font-bold text-ink">Payment</legend>
            <p className="mt-1.5 text-sm text-ink-muted">
              No booking fee. Taxes included in the price you see.
            </p>

            {/* Placeholder — replace with Stripe Elements. Nothing typed here
                is read, stored or transmitted. */}
            <div
              aria-hidden
              className="mt-5 space-y-3 rounded-[var(--radius)] border border-dashed border-line-strong bg-sunken p-4"
            >
              <div className="h-11 rounded-[var(--radius)] border border-line bg-paper" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-11 rounded-[var(--radius)] border border-line bg-paper" />
                <div className="h-11 rounded-[var(--radius)] border border-line bg-paper" />
              </div>
              <p className="text-xs text-ink-subtle">
                Card fields are a placeholder in this build — the payment provider is not
                connected yet, and no card data is collected.
              </p>
            </div>
          </fieldset>

          <div className="pt-8">
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Confirming…" : `Pay ${formatCad(total)} and confirm`}
            </Button>
            <p className="mt-3 text-center text-xs leading-relaxed text-ink-muted">
              By confirming you accept our{" "}
              <Link href="/terms" className="underline underline-offset-2">
                terms of carriage
              </Link>
              . Free changes up to 2 hours before departure; full refund if you cancel 24
              hours ahead.
            </p>
          </div>
        </form>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[calc(var(--radius)+0.2rem)] border border-line bg-sunken p-5">
            <h2 className="font-display text-lg font-bold text-ink">Order summary</h2>

            <div className="mt-4 flex items-start gap-3 border-b border-line pb-4">
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-[var(--radius)] bg-brand-800 font-display text-base font-bold text-white tabular"
              >
                {route.number}
              </span>
              <div className="min-w-0">
                <p className="font-sans text-[0.9375rem] font-bold leading-tight text-ink">
                  {route.name}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {stopById(route.originId).shortName} →{" "}
                  {stopById(route.destinationId).shortName}
                </p>
              </div>
            </div>

            <dl className="space-y-2 border-b border-line py-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Date</dt>
                <dd className="text-right font-medium text-ink">{formatDateLong(date)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Departs</dt>
                <dd className="font-medium text-ink tabular">
                  {formatMinutesLabel(departureMinutes)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Arrives</dt>
                <dd className="font-medium text-ink tabular">
                  {formatMinutesLabel(departureMinutes + route.durationMinutes)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Return</dt>
                <dd className="text-right font-medium text-ink">
                  {route.tripType === "round-trip" ? "Open — any bus" : "One way"}
                </dd>
              </div>
            </dl>

            <dl className="space-y-2 border-b border-line py-4 text-sm">
              {PAX_KEYS.filter((k) => pax[k] > 0).map((k) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-ink-muted">
                    {PAX_LABEL[k]} × {pax[k]}
                  </dt>
                  <dd className="font-medium text-ink tabular">
                    {formatCad(pax[k] * route.fares[k])}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Booking fee</dt>
                <dd className="font-medium text-ontime-ink">None</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Parking</dt>
                <dd className="font-medium text-ontime-ink">Included</dd>
              </div>
            </dl>

            <div className="flex items-baseline justify-between pt-4">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-display text-2xl font-bold text-ink tabular">
                {formatCad(total)}
              </span>
            </div>

            <Link
              href={`/book?route=${route.slug}&date=${date}`}
              className="mt-4 block text-center text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Change departure
            </Link>
          </div>

          <div
            className={cn(
              "mt-4 rounded-[var(--radius)] border border-info/20 bg-info-bg px-4 py-3 text-xs leading-relaxed text-info-ink",
            )}
          >
            <strong className="font-semibold">Park pass not included.</strong> Every
            visitor to Banff National Park needs one, whichever shuttle they take.
          </div>

          <p className="mt-3 text-center text-xs text-ink-subtle">
            Need a hand?{" "}
            <a
              href={`tel:${site.contact.tollFree}`}
              className="font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              {site.contact.tollFreeDisplay}
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}
