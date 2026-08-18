import { Credentials, Section } from "shuttlecompany";

/**
 * The operating-authority block: who the carrier is, what it is licensed to
 * do, and where it is registered.
 *
 * This is the section that separates a scheduled operator from a booking page,
 * which is the question every visitor arriving from a sold-out Parks Canada
 * lottery is actually asking.
 */
export function Default() {
  return <Credentials />;
}

export function InSection() {
  return (
    <Section>
      <Credentials />
    </Section>
  );
}
