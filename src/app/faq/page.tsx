import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { faqs, faqTopics } from "@/data/faqs";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "FAQ — Moraine Lake & Lake Louise Shuttle Questions Answered",
  description: `${faqs.length} answers on booking, parking, park passes, sunrise times, accessibility and what happens when the road closes. Everything you need before you travel.`,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />

      <PageHeader
        eyebrow="Answers"
        title="Frequently asked questions"
        lede={`${faqs.length} answers covering booking, parking, park passes, what to bring, and what happens when things go wrong. If yours is not here, call us — a person answers.`}
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
      />

      <div className="container-page py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-subtle">
              Jump to
            </h2>
            <ul className="mt-4 space-y-1">
              {faqTopics.map((topic) => (
                <li key={topic.id}>
                  <a
                    href={`#${topic.id}`}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-[0.9375rem] font-medium text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
                  >
                    {topic.label}
                    <span className="text-xs text-ink-subtle tabular">
                      {faqs.filter((f) => f.topic === topic.id).length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[var(--radius)] border border-line bg-sunken p-4">
              <h3 className="font-sans text-[0.9375rem] font-bold text-ink">
                Still stuck?
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                Call {site.contact.tollFreeDisplay}, 6:00 am to 9:00 pm Mountain during
                the season.
              </p>
              <ButtonLink href="/contact" variant="outline" size="sm" className="mt-3">
                Contact us
              </ButtonLink>
            </div>
          </nav>

          <div className="space-y-12">
            {faqTopics.map((topic) => {
              const items = faqs.filter((f) => f.topic === topic.id);
              if (items.length === 0) return null;
              return (
                <section key={topic.id} id={topic.id} className="scroll-mt-32">
                  <h2 className="font-display text-2xl font-bold text-ink">
                    {topic.label}
                  </h2>
                  <FaqAccordion items={items} className="mt-5" />
                </section>
              );
            })}

            <p className="text-sm text-ink-muted">
              Looking for something more specific? Try the{" "}
              <Link href="/routes" className="font-semibold text-brand-700 underline underline-offset-4">
                route pages
              </Link>{" "}
              for timetables and boarding locations, or the{" "}
              <Link href="/how-to-get-to-moraine-lake" className="font-semibold text-brand-700 underline underline-offset-4">
                Moraine Lake planning guide
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
