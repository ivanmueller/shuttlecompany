import { BookingSteps } from "shuttlecompany";

/**
 * The three-step progress indicator across the booking funnel. `current` is
 * 1-indexed and maps to choose → details → confirmed.
 *
 * Completed steps stay legible rather than dimming out, so a rider can see how
 * much is left before committing card details.
 */
export function ChooseADeparture() {
  return <BookingSteps current={1} />;
}

export function TravellerDetails() {
  return <BookingSteps current={2} />;
}

export function Confirmed() {
  return <BookingSteps current={3} />;
}
