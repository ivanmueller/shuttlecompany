import { AlpineScene } from "@/components/brand/alpine-scene";
import { HeroPhoto } from "@/components/brand/hero-photo";
import { site } from "@/config/site";

/**
 * Whatever sits behind the hero.
 *
 * One seam, so the drawn placeholder and the real photograph are
 * interchangeable: set `site.heroPhoto` and this swaps, with no edit to the
 * hero itself and no change to the scrim, the headline treatment or the
 * booking card stacked on top.
 *
 * Server component on purpose — the config stays out of the client bundle,
 * and only the error path in `HeroPhoto` needs the browser.
 */
export function HeroBackdrop() {
  const photo = site.heroPhoto;

  if (!photo) {
    return <AlpineScene className="absolute inset-0 size-full" />;
  }

  return <HeroPhoto src={photo.src} alt={photo.alt} focus={photo.focus} />;
}
