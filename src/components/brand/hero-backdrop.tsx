import Image from "next/image";
import { AlpineScene } from "@/components/brand/alpine-scene";
import { site } from "@/config/site";

/**
 * Whatever sits behind the hero.
 *
 * One seam, so the drawn placeholder and the real photograph are
 * interchangeable: set `site.heroPhoto` and this swaps, with no edit to the
 * hero itself and no change to the scrim, the headline treatment or the
 * booking card stacked on top.
 *
 * The hero image is the LCP element on the page that matters most, so it is
 * eagerly fetched rather than lazy-loaded. Next 16 deprecated `priority` in
 * favour of `preload`, which is the documented choice for exactly this case —
 * a single above-the-fold hero whose URL should be in the <head> rather than
 * discovered partway down the <body>.
 *
 * `sizes="100vw"` is not decoration either: with `fill` and no `sizes`, Next
 * emits a narrow 1x/2x srcset instead of the full responsive one, and phones
 * end up downloading a desktop-width frame over park LTE.
 */
export function HeroBackdrop() {
  const photo = site.heroPhoto;

  if (!photo) {
    return <AlpineScene className="absolute inset-0 size-full" />;
  }

  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      preload
      sizes="100vw"
      className="object-cover"
      style={{ objectPosition: photo.focus }}
    />
  );
}
