# Brand & theming

The brand colour is **deliberately not decided**. Everything visual resolves
through CSS custom properties, so choosing the real palette later is a
single-block edit, not a redesign.

## How to re-brand the entire site

Open `src/app/globals.css` and edit **block 1 only**. Nothing else in the
codebase contains a brand hex — buttons, links, the header, badges, focus
rings, the route roundels, the hero illustration and the generated OG image
all read from these eleven variables.

```css
:root {
  --brand-50 … --brand-950   /* the brand ramp */
  --accent-400 … --accent-700 /* the CTA accent */
}
```

Two things to update alongside it:

| File | What to change |
| --- | --- |
| `src/app/layout.tsx` | `viewport.themeColor` — the mobile browser chrome colour. Use `--brand-700`. |
| `src/app/opengraph-image.tsx` | The three literal hexes at the top. Satori cannot resolve CSS variables, so the social card keeps its own copy. |

## Current placeholder

A deep, desaturated **alpine slate-teal**. Chosen because it reads as an
established transit operator, holds AA contrast against white at 700+, and is
visibly distinct from the two operators we compete with most directly — Roam's
forest green (`#0e6750`) and Moraine Lake Bus Company's teal (`#275151`).

It is intentionally a little reserved. It will not be anybody's favourite
colour, which is the correct property for a placeholder.

## Ready-to-paste alternates

Each has been checked for AA contrast on the combinations the UI actually
uses: `--brand-800` background with white text, `--brand-700` text on white,
and `--brand-600` as a focus ring on `--paper`.

### A. Glacier blue — the "modern intercity operator" direction

Closest to Ember. Reads contemporary and tech-forward; least like a national
park operator.

```css
--brand-50:  #eff6fb;  --brand-100: #d9e9f6;  --brand-200: #b6d4ee;
--brand-300: #85b7e1;  --brand-400: #5495d0;  --brand-500: #3778bb;
--brand-600: #2b5f9d;  --brand-700: #264e7f;  --brand-800: #24436a;
--brand-900: #223a59;  --brand-950: #17253b;
```

### B. Spruce — the "national park authority" direction

Closest to Roam and to Parks Canada's own visual language. Highest instant
credibility in this specific market, lowest differentiation.

```css
--brand-50:  #f0f7f2;  --brand-100: #dcebe0;  --brand-200: #bcd7c4;
--brand-300: #90bb9e;  --brand-400: #619a74;  --brand-500: #417d57;
--brand-600: #2f6444;  --brand-700: #265038;  --brand-800: #21402e;
--brand-900: #1c3527;  --brand-950: #0f1e16;
```

### C. Summit slate — the "premium, colour-neutral" direction

Nearly achromatic, letting the accent and the status colours do all the work.
Ages the best and photographs the best against real mountain imagery.

```css
--brand-50:  #f4f5f6;  --brand-100: #e4e6e9;  --brand-200: #cbcfd4;
--brand-300: #a7aeb7;  --brand-400: #7c8794;  --brand-500: #616c79;
--brand-600: #525b66;  --brand-700: #464d56;  --brand-800: #3e434a;
--brand-900: #373b41;  --brand-950: #232629;
```

## The accent is a separate decision

`--accent-*` is the CTA colour and it is deliberately **not** derived from the
brand ramp. A primary button in the brand colour disappears the moment it sits
inside a brand-coloured section, which is the single most common conversion
leak on the competitor sites benchmarked for this build.

Whatever brand colour is chosen, the accent needs to:

- clear 4.5:1 against `--ink` (`#16181c`), since the button label is dark
- be visibly warmer or more saturated than the brand ramp
- not collide with the status colours below

The current amber does all three.

## Status colours are not brand colours

`--status-*` in block 2 follows the conventions riders already read on
platform displays: green on schedule, amber delayed, red disrupted, blue
advisory. **Do not re-tint these to match the brand.** They carry meaning, and
that meaning has to survive a re-brand.

Colour is never the only signal — every status pill carries a text label and a
dot, so the interface still works in greyscale and for colour-blind riders.

## Typography

| Role | Face | Why |
| --- | --- | --- |
| Display / headings | Source Serif 4 | Every established transit authority benchmarked uses a serif. It is the cheapest available signal that an operator has been running longer than one season. |
| Interface / body | Inter | What Ember uses. Excellent at small sizes, and its tabular figures keep timetable columns aligned. |

Both load through `next/font/google`, so they self-host at build time — no
third-party request, no layout shift.

## Placeholder assets to replace before launch

| Asset | Where | Note |
| --- | --- | --- |
| Hero backdrop | `src/components/brand/alpine-scene.tsx` | A drawn SVG scene, not a photograph. Replace with a licensed or commissioned image behind the same `.scrim-photo`. Do **not** reuse a competitor's photography. |
| Wordmark | `src/components/brand/logo.tsx` | Drawn in `currentColor`, no baked-in hex. Swap for the real mark. |
| Company name | `src/config/site.ts` | "Larch Line" is a placeholder — see the note in that file. |
| Review counts | `src/config/site.ts` → `proof` | `verified: false` suppresses `AggregateRating` in the JSON-LD. Do not flip it until the reviews are real and substantiable. |
