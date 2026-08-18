/**
 * design-sync shim for `next/image`.
 *
 * Renders the plain `<img>` that `next/image` produces in the browser, minus
 * the optimizer URL rewriting (which needs a Next server). `fill` is
 * reproduced with the absolute-inset box Next applies for it, so
 * `object-cover` / `object-position` styling on the caller still behaves.
 * Optimizer-only props are dropped rather than forwarded, so React never sees
 * an unknown DOM attribute.
 */
import * as React from "react";

type NextOnly = {
  fill?: boolean; priority?: boolean; preload?: boolean; quality?: number | string;
  loader?: unknown; placeholder?: unknown; blurDataURL?: string; unoptimized?: boolean;
  onLoadingComplete?: unknown; overrideSrc?: string;
};

export default React.forwardRef<
  HTMLImageElement,
  { src: string | { src: string }; alt: string } & NextOnly &
    Omit<React.ComponentPropsWithoutRef<"img">, "src" | "alt">
>(function Image(props, ref) {
  const {
    src, alt, fill, priority, preload, quality, loader, placeholder, blurDataURL,
    unoptimized, onLoadingComplete, overrideSrc, style, ...rest
  } = props;
  const fillStyle: React.CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : undefined;
  return (
    <img
      ref={ref}
      src={typeof src === "string" ? src : src.src}
      alt={alt}
      style={{ ...fillStyle, ...style }}
      {...rest}
    />
  );
});
