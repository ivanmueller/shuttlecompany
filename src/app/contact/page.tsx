import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us — Bookings, Groups & Support",
  description: `Call ${site.contact.tollFreeDisplay} or email ${site.contact.email}. Dispatch is staffed 3:00 am to 10:00 pm Mountain during the operating season.`,
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    title: "Call us",
    detail: site.contact.tollFreeDisplay,
    href: `tel:${site.contact.tollFree}`,
    body: "Staffed 3:00 am to 10:00 pm Mountain during the season. A person answers — no menu tree. Fastest for anything happening today.",
  },
  {
    title: "Email us",
    detail: site.contact.email,
    href: `mailto:${site.contact.email}`,
    body: "For groups, charters, media and anything that needs a paper trail. We reply within one business day.",
  },
  {
    title: "Change a booking",
    detail: "Use the link in your email",
    href: "/faq#booking",
    body: "Free changes up to 2 hours before departure, no phone call needed. Full refund if you cancel 24 hours ahead.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        lede="If your bus is today, call. Everything else, email — we answer within one business day."
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <Section className="py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {channels.map((channel) => (
            <div
              key={channel.title}
              className="flex flex-col rounded-[calc(var(--radius)+0.2rem)] border border-line p-6"
            >
              <h2 className="font-display text-xl font-bold text-ink">{channel.title}</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {channel.body}
              </p>
              <ButtonLink
                href={channel.href}
                variant="outline"
                size="md"
                className="mt-5 w-full"
              >
                {channel.detail}
              </ButtonLink>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Where we are</h2>
            <address className="mt-4 not-italic leading-relaxed text-ink-muted">
              {site.legalName}
              <br />
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region} {site.address.postalCode}
              <br />
              Canada
            </address>
            <p className="mt-4 text-sm text-ink-muted">
              Our kiosk at the Lake Louise Village Transit Hub is staffed from 3:00 am
              through last departure during the operating season. Walk-up sales are
              available there subject to availability.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              Groups, charters and media
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Groups of 12 or more get a discounted rate and a held block of seats.
              Full-vehicle charters are available for weddings, conferences, film crews
              and shuttle contracts.
            </p>
            <p className="mt-3 leading-relaxed text-ink-muted">
              Email{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="font-semibold text-brand-700 underline underline-offset-4"
              >
                {site.contact.email}
              </a>{" "}
              with your dates, headcount and pickup point and we will confirm within one
              business day.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
