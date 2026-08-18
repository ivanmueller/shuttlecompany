import { ButtonLink } from "shuttlecompany";

/**
 * The anchor form of Button — same five variants, same three sizes.
 *
 * Use this for anything that navigates. External, `tel:` and `mailto:` hrefs
 * are detected and get the right rel/target treatment automatically, so you
 * never need to pass them yourself.
 */
export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink href="/book">Book a seat</ButtonLink>
      <ButtonLink href="/routes" variant="brand">Routes &amp; schedules</ButtonLink>
      <ButtonLink href="/fares" variant="outline">Fares</ButtonLink>
      <ButtonLink href="/faq" variant="ghost">Read the FAQ</ButtonLink>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink href="/book" size="sm">Small</ButtonLink>
      <ButtonLink href="/book" size="md">Medium</ButtonLink>
      <ButtonLink href="/book" size="lg">Book a seat</ButtonLink>
    </div>
  );
}

/** External and telephone hrefs get their rel/target handling without extra props. */
export function ExternalAndPhone() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink href="https://www.pc.gc.ca" variant="outline">
        Parks Canada reservations
      </ButtonLink>
      <ButtonLink href="tel:+1-833-555-0142" variant="ghost">
        Call 1-833-555-0142
      </ButtonLink>
    </div>
  );
}
