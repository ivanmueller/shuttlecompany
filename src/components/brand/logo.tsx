import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Placeholder wordmark.
 *
 * The mark is a stylised larch sprig inside a route roundel — it reads as a
 * transit badge at 24px, which is the only size that matters on mobile. It is
 * drawn in `currentColor` so it inverts cleanly on the dark header without a
 * second asset, and carries no baked-in brand hex to unpick later.
 */
export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        tone === "light" ? "text-white" : "text-brand-900",
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden
        className="size-8 shrink-0"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="1.25"
          y="1.25"
          width="29.5"
          height="29.5"
          rx="8.5"
          stroke="currentColor"
          strokeWidth="1.75"
          opacity="0.9"
        />
        {/* Larch sprig — three tiers, echoing the Ten Peaks silhouette. */}
        <path d="M16 6.5v19" stroke="currentColor" strokeWidth="1.9" />
        <path
          d="M16 10.5 10.5 15M16 10.5 21.5 15M16 15.5 9 21M16 15.5 23 21M16 20.5l-4.5 3.5M16 20.5l4.5 3.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.0625rem] font-bold tracking-tight">
          {site.name}
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.16em]",
            tone === "light" ? "text-white/70" : "text-ink-subtle",
          )}
        >
          Banff · Lake Louise
        </span>
      </span>
    </span>
  );
}
