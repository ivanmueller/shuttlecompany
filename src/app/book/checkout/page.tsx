import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutClient } from "@/components/booking/checkout-client";
import { PageHeader } from "@/components/layout/page-header";
import { BookingSteps } from "@/components/booking/booking-steps";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Traveller details"
        lede="Two fields and a card. Your ticket arrives by email within seconds."
      >
        <BookingSteps current={2} />
      </PageHeader>
      <Suspense
        fallback={
          <div className="container-page py-16">
            <p className="text-sm text-ink-muted">Loading your trip…</p>
          </div>
        }
      >
        <CheckoutClient />
      </Suspense>
    </>
  );
}
