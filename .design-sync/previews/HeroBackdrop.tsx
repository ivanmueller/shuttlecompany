import { HeroBackdrop } from "shuttlecompany";

/**
 * The gradient and texture layer behind the home page hero. It fills its
 * parent absolutely, so it needs a `relative` box with a height.
 *
 * It sits under the hero copy rather than under photography — the two are
 * alternatives, not layers.
 */
export function Standalone() {
  return (
    <div className="relative h-80 overflow-hidden rounded-[var(--radius)]">
      <HeroBackdrop />
    </div>
  );
}

/** What it is for: a legible ground for white hero copy. */
export function WithHeroCopy() {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] px-8 py-16">
      <HeroBackdrop />
      <div className="relative">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
          Every 20 minutes
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold text-white">
          Moraine Lake without the lottery
        </h2>
        <p className="mt-4 max-w-lg text-white/80">
          Seats released daily. $29 round trip, free parking, open return.
        </p>
      </div>
    </div>
  );
}
