import { Logo } from "shuttlecompany";

/**
 * The wordmark: a stylised larch sprig inside a route roundel, drawn to read
 * as a transit badge at 24px — the only size that matters on mobile.
 *
 * It is drawn in `currentColor`, so `tone` is all that is needed to invert it
 * on the dark header; there is no second asset.
 *
 * The roundel is fixed at `size-8`; a `className` type-size only moves the
 * wordmark beside it, so there is no meaningful size sweep to show.
 */
export function OnPaper() {
  return <Logo />;
}

export function OnBrand() {
  return (
    <div className="rounded-[var(--radius)] bg-brand-900 p-8">
      <Logo tone="light" />
    </div>
  );
}
