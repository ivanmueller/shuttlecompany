import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingClient } from "@/components/booking/booking-client";
import { PageHeader } from "@/components/layout/page-header";
import { BookingSteps } from "@/components/booking/booking-steps";

export const metadata: Metadata = {
  title: "Book a Seat — Moraine Lake & Lake Louise Shuttle",
  description:
    "Pick a departure and book in under a minute. Live seat availability, no booking fee, free changes up to 2 hours before departure.",
  alternates: { canonical: "/book" },
  // The funnel has no unique content to rank and its query strings would
  // generate thousands of near-duplicate URLs. Keep it out of the index.
  robots: { index: false, follow: true },
};

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Choose your departure"
        lede="Live availability for every route this season. Nothing is held back for a reservation window."
      >
        <BookingSteps current={1} />
      </PageHeader>

      <Suspense
        fallback={
          <div className="container-page py-16">
            <p className="text-sm text-ink-muted">Loading departures…</p>
          </div>
        }
      >
        <BookingClient />
      </Suspense>
    </>
  );
}
