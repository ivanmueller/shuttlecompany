# design-sync notes — shuttlecompany

Repo-specific gotchas for syncing this design system to claude.ai/design.
Read this before a re-sync.

## What this repo is

A Next.js 16 **application**, not a published component library: `private: true`,
no build output, components under `src/components/`. The converter runs in
synth-entry mode (`[NO_DIST]` is expected, not a failure) and bundles straight
from source. Everything below exists to make that work without touching a single
component file.

## Per-clone setup (nothing here is committed)

1. `npm ci`
2. `ln -sfn ../ node_modules/shuttlecompany` — the converter resolves the package
   at `<node-modules>/<pkg>`, which npm never self-installs. Without it the build
   dies with `ENOENT … node_modules/shuttlecompany/package.json`.
3. Stage the scripts (`cp -r "<skill-base-dir>"/… .ds-sync/`), then
   `cd .ds-sync && npm i esbuild ts-morph @types/react @tailwindcss/cli`
4. Playwright: chromium is preinstalled at `/opt/pw-browsers` (build **1194**),
   which pins **playwright@1.56.0**. Install with
   `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright@1.56.0` inside `.ds-sync`.
   A different playwright version fails with "Executable doesn't exist".

Then: `node .design-sync/prepare.mjs` (this is `cfg.buildCmd`) before every
converter run.

## The four things that had to be solved

- **next/link, next/image, next/navigation** throw outside a Next app router.
  `.design-sync/tsconfig.sync.json` rebinds them to `shims/`. Two rules that file
  must keep, both silent-failure traps:
  - `"@/config/site"` MUST stay above the `"@/*"` wildcard — first match wins.
  - **`/* */` comments only.** The converter strips `//` line comments with a
    regex that corrupts a `"//"` JSON key; `JSON.parse` then throws, the plugin
    returns null, and *every* path mapping silently stops binding. The build
    still succeeds — you find out when Next internals appear in the bundle.
- **`process` is not defined.** `src/config/site.ts` reads `NEXT_PUBLIC_*`, which
  Next inlines at build time and nothing inlines here, so the whole IIFE dies
  before any export reaches `window.LarchLine` — every card blank. `shims/site.ts`
  imports `shims/process-env.ts` first (ES modules evaluate imports in source
  order) and re-exports the real config unchanged.
- **Tailwind v4 CSS doesn't exist until compiled.** `prepare.mjs` runs the
  Tailwind CLI over `tailwind-entry.css`.
- **No types → empty prop contracts.** Without a `.d.ts` tree every component
  emitted `[key: string]: unknown`, which is exactly what the design agent codes
  against. `prepare.mjs` emits declarations to `dist/types`, rewrites the `@/`
  specifiers tsc leaves behind (they resolve to nothing in the converter's
  ts-morph project — `StatusPill.status` degrades to `any`), and writes the
  barrel that `package.json#types` points at.

## Known render warns (expected — not new)

- `[RENDER_THIN] HeroPhoto: mounts have no text and paint nothing` — HeroPhoto is
  purely graphical and the preview host does not serve the app's `public/`, so it
  renders its documented `AlpineScene` fallback. Screenshot confirmed correct.
- `tokens: 2 missing, below threshold` — benign.
- `JsonLd` ships the typographic floor card **by design**: it renders a
  `<script type="application/ld+json">` and has no visual output. Not a failure.

## Gotchas learned the hard way

- **Never run `package-build.mjs` after capturing.** The build wipes
  `ds-bundle/_screenshots/`, losing every review sheet. Order is always
  prepare → build → validate → capture → grade. Grades survive (they live in
  `.design-sync/.cache/review/`), the sheets do not.
- Changing `cfg.overrides` requires a **full** build — `preview-rebuild.mjs`
  refuses with `[CONFIG_STALE]`.
- `SiteHeader` and `HeaderNav` collapse to a hamburger below `lg` (1024px), so
  both are pinned to `cardMode: single` at a 1280px viewport or the card shows no
  navigation at all.
- `StickyBookBar` is `sm:hidden` **and** stays translated off-screen until
  `scrollY > 240`. Its preview stages a phone viewport, a tall page and a scroll
  on mount; without all three the card is blank.
- `HeroPlanner` renders white type and is invisible on white — its preview mounts
  the `on-dark` / `bg-brand-900` hero shell from `src/app/page.tsx`.
- `PageHeader` prepends its own "Home" breadcrumb; passing one duplicates it.
- `SeatsPill`'s seat count is suppressed unless `site.inventoryIsLive` is true, so
  `seats` currently has no visible effect.
- Preview dates are pinned to `2026-08-12` (in season: 2026-05-15 → 2026-10-13).
  Using `todayISO()` would re-hash previews daily and make every re-sync look
  like a change.

## Re-sync risks — what can go stale

- **The Tailwind safelist in `tailwind-entry.css` is hand-maintained.** Tailwind
  only emits utilities it finds in source, so a token added to the `@theme inline`
  block in `src/app/globals.css` will NOT reach the shipped stylesheet until it is
  added to the safelist too. Designs using it would render unstyled, and nothing
  warns. Check both files together.
- **`package.json` carries a `"types"` field pointing into gitignored `dist/`.**
  It exists only for the converter's prop extraction. It is dangling in a fresh
  clone until `prepare.mjs` runs. Do not "clean it up".
- **Fonts are committed binaries.** `.design-sync/fonts/` holds Inter and Source
  Serif 4 fetched from Google, mirroring what `next/font` self-hosts. If
  `src/app/layout.tsx` changes family, weight or subset, re-run
  `.design-sync/fetch-fonts.mjs`. Nothing detects the drift.
- **Previews import repo data** (`routes`, `faqs`, `landingPages`) via
  `cfg.extraEntries`, so they follow the real network data — but a renamed slug
  (`routeBySlug("moraine-lake-express")!`) becomes a runtime null and the card
  goes blank. Slug renames need a preview sweep.
- **Booking previews seed `window.location.search`** at module scope.
  `CheckoutClient` and `ConfirmedClient` rebuild their trip from the query string;
  if those param names change, the cards fall back to their recovery states.
- The three page-level booking clients render tall and are cropped by the card
  height. Content is complete; only the card viewport truncates.

## Not yet uploaded

The build is verified but has never been pushed to a Claude Design project:
`DesignSync` could not authorize in the claude.ai/code environment, so there is
no `projectId` in `config.json` and no `_ds_sync.json` anchor upstream. The first
sync from an interactive terminal will be a full first-time upload.
