/**
 * design-sync shim for `next/navigation`.
 *
 * Reads real browser location, so a preview card can drive a component's
 * state through its own query string (e.g. `BookingClient.html?route=…`) and
 * components that branch on the path — `StickyBookBar` hides itself under
 * `/book`, `HeaderNav` marks the active item — behave the way they do in the
 * app. Navigation itself is inert: a card is a static render, and pushing a
 * URL would only navigate the preview iframe away from the component.
 */
import * as React from "react";

const search = () =>
  new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);

export function useSearchParams(): URLSearchParams {
  return React.useMemo(search, []);
}

export function usePathname(): string {
  return typeof window === "undefined" ? "/" : window.location.pathname;
}

export function useRouter() {
  return React.useMemo(
    () => ({
      push: () => {}, replace: () => {}, back: () => {}, forward: () => {},
      refresh: () => {}, prefetch: () => {},
    }),
    [],
  );
}

export function notFound(): never {
  throw new Error("[next-navigation-shim] notFound() called — the page data was missing.");
}

export function redirect(): never {
  throw new Error("[next-navigation-shim] redirect() called.");
}
