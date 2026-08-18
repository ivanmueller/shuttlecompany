import { HowItWorks, Section } from "shuttlecompany";

/**
 * The three-step explainer: pick a departure, show the pass, ride.
 *
 * It answers the objection that a scheduled shuttle is complicated to use,
 * which is the main thing that sends a hesitant visitor back to a tour
 * operator.
 */
export function Default() {
  return <HowItWorks />;
}

/** How it ships — inside a sunken section band. */
export function InSection() {
  return (
    <Section tone="sunken">
      <HowItWorks />
    </Section>
  );
}
