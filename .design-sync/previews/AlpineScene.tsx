import { AlpineScene } from "shuttlecompany";

/**
 * The drawn Rockies placeholder that stands in for hero photography, and the
 * live fallback `HeroPhoto` degrades to when its image 404s.
 *
 * It is absolutely positioned to fill its parent, so it always needs a
 * `relative` box with a real height around it.
 */
export function InAHeroBox() {
  return (
    <div className="relative h-80 overflow-hidden rounded-[var(--radius)]">
      <AlpineScene className="absolute inset-0 size-full" />
    </div>
  );
}

/** Wide and short — the aspect the home page hero actually uses. */
export function Panoramic() {
  return (
    <div className="relative h-48 overflow-hidden rounded-[var(--radius)]">
      <AlpineScene className="absolute inset-0 size-full" />
    </div>
  );
}

/** With content over it, which is the only way it ships. */
export function WithOverlaidCopy() {
  return (
    <div className="relative h-72 overflow-hidden rounded-[var(--radius)]">
      <AlpineScene className="absolute inset-0 size-full" />
      <div className="relative flex h-full flex-col justify-end p-8">
        <p className="font-display text-3xl font-bold text-white">
          Moraine Lake, every 20 minutes
        </p>
      </div>
    </div>
  );
}
