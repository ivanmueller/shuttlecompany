import { Button, ButtonLink } from "shuttlecompany";

/**
 * The five variants, in the order the design system ranks them.
 *
 * `primary` is gold rather than brand blue on purpose — a brand-coloured
 * primary disappears inside a brand-coloured section, which is the conversion
 * leak the palette was built to avoid.
 */
export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Book a seat</Button>
      <Button variant="brand">Find departures</Button>
      <Button variant="outline">See the timetable</Button>
      <Button variant="ghost">Change date</Button>
    </div>
  );
}

/** `quiet` is the on-dark variant — it only reads correctly over brand or photography. */
export function QuietOnDark() {
  return (
    <div className="rounded-[var(--radius)] bg-brand-900 p-6">
      <Button variant="quiet">Check service status</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Book a seat</Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Sold out</Button>
      <Button variant="outline" disabled>
        Unavailable
      </Button>
    </div>
  );
}

/** Same visual contract as Button, but renders an anchor — use it for navigation. */
export function AsLink() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink href="/book">Book a seat</ButtonLink>
      <ButtonLink href="/routes" variant="outline">
        Routes &amp; schedules
      </ButtonLink>
    </div>
  );
}
