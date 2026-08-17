import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmedClient } from "@/components/booking/confirmed-client";
import { PageHeader } from "@/components/layout/page-header";
import { BookingSteps } from "@/components/booking/booking-steps";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="You're on the bus"
        lede="Your ticket is on its way by email. Here is everything you need for the morning."
      >
        <BookingSteps current={3} />
      </PageHeader>
      <Suspense
        fallback={
          <div className="container-page py-16">
            <p className="text-sm text-ink-muted">Loading your booking…</p>
          </div>
        }
      >
        <ConfirmedClient />
      </Suspense>
    </>
  );
}
