import { SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

/**
 * How it works.
 *
 * Four steps, no more. Every competitor's version of this section runs long
 * and buries the one thing a first-time visitor is actually anxious about,
 * which is whether they will be standing in the right place at the right time
 * with no cell service. So step three is the one with the most detail.
 */

const steps = [
  {
    n: "1",
    title: "Pick a departure",
    body: "Choose your route, date and time. Availability is live — what you see is what is actually left on that bus.",
  },
  {
    n: "2",
    title: "Pay and get your ticket",
    body: "Card or Apple Pay, no account required, no booking fee. Your ticket and a map to your boarding bay arrive by email within seconds.",
  },
  {
    n: "3",
    title: "Park free and board",
    body: "Drive to the Park & Ride — your space is reserved. Arrive 15 minutes early; on peak days the walk to the bays takes close to 10. Screenshot your ticket before you leave: there is no cell service at Moraine Lake.",
  },
  {
    n: "4",
    title: "Come back when you're ready",
    body: "Show the same ticket and board any return bus with an open seat. Longest you will wait on Route 1 is 20 minutes.",
  },
];

export function HowItWorks() {
  return (
    <div>
      <SectionHeading
        eyebrow="From booking to boarding"
        title="Four steps, about ninety seconds"
        lede="No account to create, no reservation window to wait for, and no printed voucher to lose."
      />

      <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {steps.map((step, i) => (
          <li key={step.n} className="relative">
            {/* Connector, desktop only. */}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute left-12 top-5 hidden h-px w-[calc(100%-2rem)] bg-line lg:block"
              />
            )}
            <span
              aria-hidden
              className="relative grid size-10 place-items-center rounded-full border border-brand-200 bg-brand-50 font-display text-base font-bold text-brand-800"
            >
              {step.n}
            </span>
            <h3 className="mt-4 font-sans text-[1.0625rem] font-bold text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <ButtonLink href="/book?to=moraine-lake" size="lg">
          See today&apos;s departures
        </ButtonLink>
        <ButtonLink href="/stops" variant="outline" size="lg">
          Where to find us
        </ButtonLink>
      </div>
    </div>
  );
}
