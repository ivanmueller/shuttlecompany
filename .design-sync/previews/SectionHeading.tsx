import { SectionHeading } from "shuttlecompany";

/**
 * Section title block: optional eyebrow, a serif display title, optional lede.
 *
 * The eyebrow carries the positioning claim and the title carries the promise —
 * on this site the eyebrow is almost always a frequency or a season, because
 * availability is the thing the competition cannot match.
 */
export function Centered() {
  return (
    <SectionHeading
      eyebrow="Every 20 minutes"
      title="Seats released daily, all season"
      lede="Parks Canada allocates a fixed number of seats through a lottery. We release inventory every morning, so same-day travel is still possible."
    />
  );
}

export function LeftAligned() {
  return (
    <SectionHeading
      align="left"
      eyebrow="Who you're booking with"
      title="A licensed carrier, not a booking page"
      lede="Registered with Alberta Transportation and operating under a Parks Canada business licence."
    />
  );
}

/** `light` is the on-brand treatment — it only reads over a dark section. */
export function OnBrand() {
  return (
    <div className="rounded-[var(--radius)] bg-brand-900 p-10">
      <SectionHeading
        tone="light"
        eyebrow="Season 2026"
        title="May 15 – October 13"
        lede="Service runs daily through the larch season."
      />
    </div>
  );
}

/** Title only — the minimum useful form. */
export function TitleOnly() {
  return <SectionHeading title="Frequently asked questions" />;
}
