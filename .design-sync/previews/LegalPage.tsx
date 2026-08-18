import { LegalPage } from "shuttlecompany";

/**
 * Renders one of the structured legal documents by id — the same block
 * pipeline as the landing pages, so the terms stay consistent with the rest of
 * the site rather than being a pasted Word document.
 *
 * The content is a structured draft, not legal advice; the terms of carriage
 * in particular carry real liability exposure for a passenger carrier
 * operating in a national park.
 */
export function Terms() {
  return <LegalPage id="terms" />;
}

export function Privacy() {
  return <LegalPage id="privacy" />;
}

export function Accessibility() {
  return <LegalPage id="accessibility" />;
}
