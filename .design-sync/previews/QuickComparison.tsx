import { QuickComparison, Section } from "shuttlecompany";

/**
 * The compressed competitor comparison that sits directly under the hero.
 *
 * The full `ComparisonTable` is six screens further down than most people
 * scroll, so this answers "which shuttle should I book?" while the visitor is
 * still deciding whether to stay.
 */
export function Default() {
  return <QuickComparison />;
}

export function InSection() {
  return (
    <Section tone="sunken">
      <QuickComparison />
    </Section>
  );
}
