/**
 * design-sync shim for `next/link`.
 *
 * The preview cards and the designs the Claude Design agent builds render
 * outside a Next.js app router, where the real `next/link` throws
 * ("invariant expected app router to be mounted"). In the browser a
 * `<Link>` resolves to the anchor below anyway, so rendering it directly is
 * faithful to what a rider actually sees — only client-side navigation and
 * prefetching are dropped, neither of which a static preview exercises.
 *
 * Component source is never modified: this is bound in via the `paths` map in
 * `.design-sync/tsconfig.sync.json`, which the converter's esbuild resolver reads.
 */
import * as React from "react";

type Url = string | { pathname?: string; query?: Record<string, string | number> };

function href(u: Url): string {
  if (typeof u === "string") return u;
  const q = u.query
    ? "?" + new URLSearchParams(Object.entries(u.query).map(([k, v]) => [k, String(v)])).toString()
    : "";
  return (u.pathname ?? "") + q;
}

/** Next-only props that must not reach the DOM (React warns on unknown attributes). */
type NextOnly = {
  prefetch?: unknown; replace?: unknown; scroll?: unknown; shallow?: unknown;
  passHref?: unknown; locale?: unknown; legacyBehavior?: unknown;
};

export default React.forwardRef<
  HTMLAnchorElement,
  { href: Url } & NextOnly & Omit<React.ComponentPropsWithoutRef<"a">, "href">
>(function Link(props, ref) {
  const { href: to, prefetch, replace, scroll, shallow, passHref, locale, legacyBehavior, ...rest } =
    props;
  return <a ref={ref} href={href(to)} {...rest} />;
});
