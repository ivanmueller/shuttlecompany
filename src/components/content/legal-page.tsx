import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { legalPages } from "@/data/legal";
import { formatDateLong } from "@/lib/utils";

/** Shared renderer for the terms, privacy and accessibility pages. */
export function LegalPage({ id }: { id: string }) {
  const page = legalPages[id];
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: page.title, path: `/${id}` },
        ])}
      />

      <PageHeader
        eyebrow="Legal"
        title={page.title}
        lede={page.intro}
        breadcrumbs={[{ name: page.title, path: `/${id}` }]}
      />

      <div className="container-page py-12 md:py-16">
        <div className="max-w-[44rem]">
          <p className="text-sm text-ink-subtle">
            Last updated {formatDateLong(page.updated)}
          </p>

          <div className="mt-8 space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-xl font-bold text-ink">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="leading-relaxed text-ink-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 rounded-[var(--radius)] border border-delay/25 bg-delay-bg px-5 py-4 text-sm leading-relaxed text-delay-ink">
            <strong className="font-semibold">Draft — not yet reviewed by counsel.</strong>{" "}
            This document is a structured placeholder written to be a useful starting
            point, not legal advice. Have a lawyer review it before the site accepts a
            real payment.
          </p>
        </div>
      </div>
    </>
  );
}

export function legalMetadata(id: string): Metadata {
  const page = legalPages[id];
  if (!page) return {};
  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/${id}` },
  };
}
