/**
 * Minimal `process.env` stand-in for the browser.
 *
 * `src/config/site.ts` reads NEXT_PUBLIC_* variables that Next.js inlines at
 * build time. Nothing inlines them here, so the bundle keeps a bare `process`
 * reference and the whole IIFE dies with "process is not defined" before a
 * single export reaches `window.LarchLine` — every card blank, no obvious
 * cause. An empty env is the honest value: it is what the site itself falls
 * back to when the variables are unset.
 *
 * Imported for its side effect by ./site.ts, which must be the only route to
 * the real config (see the @/config/site mapping in tsconfig.sync.json).
 */
const g = globalThis as typeof globalThis & {
  process?: { env: Record<string, string | undefined> };
};

g.process ??= { env: {} };

export {};
