import { Section, SectionHeading, ButtonLink } from "shuttlecompany";

/**
 * The page's vertical rhythm primitive: consistent block padding plus the
 * centred `container-page` gutter. Every marketing section on the site is one
 * of these, so reach for it before writing your own wrapper.
 */
export function Paper() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Every 20 minutes"
        title="Seats released daily"
        lede="You can still travel when the Parks Canada lottery and Roam are sold out."
      />
    </Section>
  );
}

/** `sunken` is the alternating band — use it to separate two paper sections. */
export function Sunken() {
  return (
    <Section tone="sunken">
      <SectionHeading
        align="left"
        eyebrow="Straight comparison"
        title="Which shuttle should you actually book?"
      />
    </Section>
  );
}

/** `brand` inverts to white text on brand-900, and flips headings to `light`. */
export function Brand() {
  return (
    <Section tone="brand">
      <SectionHeading
        tone="light"
        eyebrow="Season 2026"
        title="The next bus leaves in 18 minutes"
        lede="No reservation window, no fixed return time."
      />
      <div className="mt-8">
        <ButtonLink href="/book">Book a seat</ButtonLink>
      </div>
    </Section>
  );
}
