import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { BlockRenderer } from "@/components/content/block-renderer";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { landingPages, landingPageBySlug } from "@/data/landing-pages";
import { faqs } from "@/data/faqs";
import { site } from "@/config/site";
import { formatDateLong } from "@/lib/utils";

/**
 * Keyword landing pages, rendered from data.
 *
 * `dynamicParams = false` means anything not in the landing-page list 404s
 * here rather than falling through, so this catch-all cannot swallow typos or
 * generate soft-404 pages for search engines to index.
 *
 * Static routes like /routes and /book take precedence over this segment, so
 * they are unaffected.
 */

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return landingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = landingPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      type: "article",
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${site.url}/${page.slug}`,
      modifiedTime: page.updated,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = landingPageBySlug(slug);
  if (!page) notFound();

  /* Every question referenced anywhere on the page, for FAQPage markup. */
  const referencedFaqs = page.blocks
    .flatMap((b) => (b.type === "faq" ? b.questions : []))
    .map((q) => faqs.find((f) => f.q === q))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: page.h1,
          description: page.metaDescription,
          path: `/${page.slug}`,
          updatedISO: page.updated,
        })}
      />
      {referencedFaqs.length > 0 && <JsonLd data={faqSchema(referencedFaqs)} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: page.h1, path: `/${page.slug}` },
        ])}
      />

      <PageHeader
        eyebrow={page.eyebrow}
        title={page.h1}
        lede={page.lede}
        breadcrumbs={[{ name: page.eyebrow, path: `/${page.slug}` }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/book" size="lg">
            Check today&apos;s departures
          </ButtonLink>
          <p className="text-xs text-ink-subtle">
            Last reviewed {formatDateLong(page.updated)}
          </p>
        </div>
      </PageHeader>

      <div className="container-page py-14 md:py-20">
        <BlockRenderer blocks={page.blocks} />

        {page.related.length > 0 && (
          <nav aria-label="Related guides" className="mt-20 border-t border-line pt-10">
            <h2 className="font-display text-xl font-bold text-ink">Keep reading</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {page.related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-full items-center justify-between gap-3 rounded-[var(--radius)] border border-line p-4 text-[0.9375rem] font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700"
                  >
                    {item.label}
                    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0 text-ink-subtle" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <section className="border-t border-line bg-brand-900 py-16 text-white">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-xl text-3xl font-bold">
            Seats are open on the next departure
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/75">
            No reservation window, no waiting list. Pick a time and go.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/book" size="lg">
              Book a seat
            </ButtonLink>
            <ButtonLink href="/routes" variant="quiet" size="lg">
              See all timetables
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
