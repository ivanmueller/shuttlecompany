/**
 * Layered alpine dawn, drawn in brand tokens.
 *
 * Placeholder for real photography. It exists so the site looks finished and
 * on-brand today without shipping someone else's licensed images — every
 * competitor hero we benchmarked is a rights-managed photograph, and copying
 * one is the fastest way to a takedown.
 *
 * Composed as first light rather than midday on purpose: the sunrise service
 * is the product no public shuttle offers, so the hero may as well sell it.
 *
 * Depth comes from four rules, which are worth preserving if this gets
 * redrawn: each ridge is lighter and lower-contrast the further back it sits,
 * the warm glow sits behind every ridge and in front of none, snow only
 * appears on the front two ridges where the eye can resolve it, and the
 * treeline is the darkest thing in the frame so the text above it stays
 * legible.
 *
 * When the real shoot lands, drop an <Image fill priority> behind the same
 * scrim and delete this. Until then it renders in ~3 kB with no network
 * request and re-themes automatically with the palette.
 */
export function AlpineScene({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-950)" />
          <stop offset="45%" stopColor="var(--brand-900)" />
          <stop offset="78%" stopColor="var(--brand-700)" />
          <stop offset="100%" stopColor="var(--brand-500)" />
        </linearGradient>

        {/* First light. Sits low and right, behind every ridge. */}
        <radialGradient id="ls-dawn" cx="0.68" cy="0.72" r="0.62">
          <stop offset="0%" stopColor="var(--accent-400)" stopOpacity="0.62" />
          <stop offset="35%" stopColor="var(--accent-500)" stopOpacity="0.26" />
          <stop offset="70%" stopColor="var(--accent-600)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--accent-600)" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="ls-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-600)" />
          <stop offset="100%" stopColor="var(--brand-800)" />
        </linearGradient>
        <linearGradient id="ls-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-800)" />
          <stop offset="100%" stopColor="var(--brand-900)" />
        </linearGradient>
        <linearGradient id="ls-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-400)" stopOpacity="0.7" />
          <stop offset="60%" stopColor="var(--brand-700)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--brand-900)" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <rect width="1440" height="760" fill="url(#ls-sky)" />
      <rect width="1440" height="760" fill="url(#ls-dawn)" />

      {/* Far range — low contrast, no detail. Reads as distance. */}
      <path
        d="M0 452 L150 372 L268 428 L410 330 L548 424 L690 356 L830 430 L980 344 L1120 424 L1268 366 L1440 440 L1440 760 L0 760 Z"
        fill="url(#ls-far)"
        opacity="0.5"
      />

      {/* Mid range — the Ten Peaks silhouette, abstracted to five summits. */}
      <path
        d="M0 520 L128 470 L232 508 L360 396 L470 470 L560 412 L664 486 L790 388 L912 478 L1030 424 L1150 496 L1290 430 L1440 502 L1440 760 L0 760 Z"
        fill="url(#ls-mid)"
      />
      {/* Snow, keyed to the mid-range summits it belongs to. */}
      <g fill="var(--brand-100)" opacity="0.35">
        <path d="M360 396 L392 418 L376 424 L360 414 L344 426 L328 418 Z" />
        <path d="M790 388 L824 412 L806 418 L788 408 L770 420 L752 412 Z" />
        <path d="M1290 430 L1318 450 L1304 456 L1288 447 L1272 457 L1258 450 Z" />
      </g>

      {/* Near ridge — dark, high contrast, anchors the composition. */}
      <path
        d="M0 596 L180 540 L318 586 L470 512 L620 580 L764 528 L910 588 L1070 534 L1214 592 L1340 552 L1440 594 L1440 760 L0 760 Z"
        fill="var(--brand-950)"
        opacity="0.92"
      />

      {/* Lake. */}
      <path d="M0 648 L1440 638 L1440 704 L0 712 Z" fill="url(#ls-water)" />
      <g
        stroke="var(--brand-100)"
        strokeOpacity="0.16"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M160 664h190M470 678h132M760 660h214M1080 682h172M300 694h164M900 698h190" />
      </g>

      {/* Shore and treeline — the darkest band, holding the base of the frame. */}
      <path d="M0 700 L1440 692 L1440 760 L0 760 Z" fill="var(--brand-950)" />
      <g fill="var(--brand-950)">
        {Array.from({ length: 36 }, (_, i) => {
          const x = i * 41 + ((i * 29) % 19);
          const h = 34 + ((i * 47) % 46);
          const w = 9 + ((i * 13) % 7);
          return (
            <path key={i} d={`M${x - w} 706 L${x} ${706 - h} L${x + w} 706 Z`} />
          );
        })}
      </g>
    </svg>
  );
}
