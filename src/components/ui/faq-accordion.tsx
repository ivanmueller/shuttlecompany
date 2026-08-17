import type { Faq } from "@/data/faqs";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion built on <details>.
 *
 * Native disclosure rather than JS state, for three reasons that all matter
 * here: the answer text is in the DOM for crawlers whether or not it is open,
 * it works before hydration, and browser find-in-page opens the right item —
 * which is how visitors actually use a 30-question FAQ.
 */
export function FaqAccordion({
  items,
  className,
}: {
  items: Faq[];
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((faq) => (
        <details key={faq.q} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="font-sans text-[1.0625rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
              {faq.q}
            </h3>
            <span
              aria-hidden
              className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line-strong text-ink-muted transition-transform duration-200 group-open:rotate-45 group-hover:border-brand-400 group-hover:text-brand-700"
            >
              <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M6 1v10M1 6h10" />
              </svg>
            </span>
          </summary>
          <p className="pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-muted">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}
