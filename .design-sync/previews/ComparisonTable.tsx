import { ComparisonTable } from "shuttlecompany";

/**
 * The full four-operator comparison: us, Parks Canada, Roam Transit and
 * Moraine Lake Bus Company, row by row.
 *
 * Note that it concedes a row — Parks Canada is genuinely cheaper and the
 * table says so. A table where the challenger wins every line reads as
 * marketing and gets discounted entirely, so do not "fix" that row.
 */
export function Default() {
  return <ComparisonTable />;
}
