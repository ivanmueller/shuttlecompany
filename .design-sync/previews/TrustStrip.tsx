import { TrustStrip } from "shuttlecompany";

/**
 * The band of verifiable operating facts that sits directly under the hero —
 * licensed carrier, free parking, open return, no booking fee.
 *
 * Everything in it is deliberately checkable. Ratings and review counts are
 * suppressed until `site.proof.verified` is true, because an unsubstantiated
 * rating is a manual-action risk in Search and a misleading-advertising risk
 * under the Competition Act.
 */
export function Default() {
  return <TrustStrip />;
}
