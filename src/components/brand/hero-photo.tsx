"use client";

import Image from "next/image";
import { useState } from "react";
import { AlpineScene } from "@/components/brand/alpine-scene";

/**
 * The hero photograph, with the drawn scene as a live fallback.
 *
 * The fallback is not defensive programming for its own sake. This is the
 * single most valuable pixel area on the site, `public/` assets are uploaded
 * by hand, and a hero that 404s renders as a hole rather than as an error —
 * nobody notices until a visitor does. Falling back to `AlpineScene` means a
 * missing or corrupt file degrades to the placeholder the site already shipped
 * with, which is a bad day rather than a broken home page.
 *
 * It also makes `site.heroPhoto` safe to point at a filename before the file
 * exists, which is what lets the photo be a drop-in with no config edit.
 *
 * The `<img>` is still server-rendered inside this client component, so the
 * preload link and the LCP timing are unaffected; only the error path needs
 * the browser.
 */
export function HeroPhoto({
  src,
  alt,
  focus,
}: {
  src: string;
  alt: string;
  focus: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <AlpineScene className="absolute inset-0 size-full" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      /* Next 16 deprecated `priority` in favour of `preload`. The docs name a
         single above-the-fold hero as exactly the case `preload` is for: the
         URL belongs in the <head>, not discovered partway down the <body>. */
      preload
      /* Required with `fill`. Without it Next emits a narrow 1x/2x srcset
         instead of the full responsive one, and a phone on park LTE downloads
         a desktop-width frame. */
      sizes="100vw"
      className="object-cover"
      style={{ objectPosition: focus }}
      onError={() => setFailed(true)}
    />
  );
}
