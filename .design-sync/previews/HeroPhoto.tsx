import { HeroPhoto } from "shuttlecompany";

/**
 * The hero photograph, with `AlpineScene` as a live fallback.
 *
 * The fallback is the point: `public/` assets are uploaded by hand and a hero
 * that 404s renders as a hole rather than an error, so a missing file degrades
 * to the placeholder the site already ships with.
 *
 * NOTE: these cards render the fallback, not a photograph — the preview host
 * serves the design system, not the app's `public/` directory, so the image
 * 404s exactly as it would for a missing upload. That makes these an honest
 * picture of the degraded state; in the app the same props render the photo.
 */
export function Fallback() {
  return (
    <div className="relative h-80 overflow-hidden rounded-[var(--radius)]">
      <HeroPhoto
        src="/hero-lake-louise.jpg"
        alt="A turquoise glacial lake below snow-streaked peaks at Lake Louise"
        focus="50% 45%"
      />
    </div>
  );
}

/** `focus` is the object-position — use it to keep the peaks in frame when cropped short. */
export function ShortCrop() {
  return (
    <div className="relative h-40 overflow-hidden rounded-[var(--radius)]">
      <HeroPhoto
        src="/hero-lake-louise.jpg"
        alt="Moraine Lake at first light"
        focus="50% 30%"
      />
    </div>
  );
}
