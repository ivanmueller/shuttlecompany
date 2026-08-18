# Brand & theming

**Alpine Blue + Larch Gold.** Deep navy carries the institution, gold carries
the action, three semantic colours carry live service state, warm stone paper
holds it all together.

Everything visual resolves through CSS custom properties, so the whole system
is a single-block edit in `src/app/globals.css`. Nothing else in the codebase
contains a brand hex.

---

## 1. Why blue

The rider landing here has already been told "no" by Parks Canada. They have
flights, a hotel and one day at Moraine Lake. The only question the brand has
to answer in the first 400ms is **"is this a real scheduled bus service, or
another tour operator?"**

Three reasons blue answers it best, in order of weight:

**It is what a public transit operator looks like.** BC Transit, TransLink,
Greyhound, Amtrak, Ember — the sector's institutional default is blue, and it
does the positioning work before a single word is read. Colour research has
converged on the same association independently: across the brand-personality
literature blue is the hue most reliably tied to *competence* and
*trustworthiness*, where red loads on excitement and yellow on cheerfulness.
Competence is the exact dimension being sold here.

**It is the only strong colour left in this market.** Roam Transit is forest
green (`#0e6750`), Moraine Lake Bus Company is teal (`#275151`), Parks Canada
is federal green. Adopting green buys instant category credibility and spends
it immediately on looking like a me-too — worse, on a category where the
entire pitch is "we are the alternative." In a Maps pin cluster, a SERP
favicon row or a rack card in a hotel lobby, deep blue is the one that
separates. That distinctiveness is free; a second brand colour later is not.

**It frames the photography instead of competing with it.** Real Rockies
imagery is glacial turquoise water and blue-green spruce. A teal brand reads
as a washed-out copy of the exact lake the visitor came to see, and a green
one fights the treeline. Navy sits behind the frame and lets the water be the
hero — which matters because the hero image is eventually a licensed
photograph, not the drawn placeholder.

### The one thing blue costs

`--status-info` was blue (`#1f5fa8`, OKLCH hue 254.6) — within a couple of
degrees of where a transit-blue brand belongs. On a blue-brand site a blue
notice reads as brand furniture rather than as a notice, and its pale field
was indistinguishable from an ordinary `--brand-50` panel. Advisory moved to
indigo. See §4.

---

## 2. The brand ramp

Built in OKLCH so the lightness ladder is perceptually even, then verified
against every contrast pair the components actually render (§6).

| Step | Hex | OKLCH | Where it is used |
| --- | --- | --- | --- |
| `--brand-50` | `#eef8ff` | `.973 .015 242` | Tinted panels, trust-strip icon wells, active nav |
| `--brand-100` | `#d8edfe` | `.936 .032 243` | Snow in the hero illustration, hairlines on dark |
| `--brand-200` | `#b2d8fa` | `.866 .062 245` | Sub-labels on dark surfaces (7.1:1 on `-800`) |
| `--brand-300` | `#84bcef` | `.775 .094 247` | Decorative borders on dark |
| `--brand-400` | `#4d92d3` | `.643 .120 249` | Hover borders on light. **Lightest step that clears 3:1 on white** |
| `--brand-500` | `#307ac2` | `.568 .133 251` | Illustration only — horizon, water |
| `--brand-600` | `#1b63ac` | `.496 .136 253` | Eyebrow labels, focus borders. **Lightest step that clears 4.5:1 on white** |
| `--brand-700` | `#104f95` | `.432 .130 255` | **The workhorse.** Brand text, links, hovers (32 uses) |
| `--brand-800` | `#0c3e7a` | `.370 .114 256` | **The brand surface.** Buttons, roundels, table headers (18 uses) |
| `--brand-900` | `#092e5e` | `.308 .095 257` | Hero, closing CTA, brand sections, wordmark |
| `--brand-950` | `#051b3c` | `.228 .070 258` | Service banner, footer, departure board, OG card |

Two invariants worth keeping if the ramp is ever regenerated:

- **600 is the lightest step that passes 4.5:1 on white; 400 is the lightest
  that passes 3:1.** Everything lighter is a surface, not a foreground.
- **Chroma does not collapse at the dark end.** The previous placeholder let
  it fall to `0.026` by step 950, which is why the hero, the footer and the
  comparison header all rendered as grey with a hint of blue rather than as a
  brand. The dark steps are where this site spends most of its colour, so
  they are where chroma has to hold.

---

## 3. Larch Gold — the accent

```
--accent-400  #f8c34b   .845 .146 84.5   flags, links on dark, focus halo
--accent-500  #ecb121   .793 .156 83     the primary CTA fill
--accent-600  #cb9317   .700 .140 80     pressed / dense states
--accent-700  #9c6c18   .568 .111 76     gold text on white (4.6:1)
```

Not derived from the brand ramp, on purpose. A primary button in the brand
colour disappears the moment it sits inside a brand-coloured section, which is
the most common conversion leak on the competitor sites benchmarked for this
build — and this site has a navy hero, a navy CTA band and a navy departure
board, so it would have happened three times on the home page alone.

Gold is the right warm colour rather than orange or red for three reasons:

- It is the **exact perceptual complement** of this blue — OKLCH hue 84
  against 255. Maximum attention per square pixel, which is what a CTA is for.
- It is **locally true**: the larches above Moraine Lake turn gold in the last
  month of the season, which is the name of the company.
- It reads **heritage/park-service** rather than discount-retail. Orange
  converts on the same contrast logic but signals "budget carrier," which
  undercuts the trust argument the navy is making.

Extend the ramp with `--accent-300 #fcd37c` and `--accent-800 #7d5417` if
lighter hovers or darker gold text are ever needed. Both are in gamut on the
same hue.

**The hue is held steady across the ramp.** The previous accent slid from hue
85 to 73 and its dark end landed directly on the amber "delay" status.

---

## 4. Status colours are not brand colours

Four states, each a family: a saturated **base** (the dot and border), a dark
**ink** (the label) and a pale **field** (the background).

| | Base | Ink | Field | Meaning |
| --- | --- | --- | --- | --- |
| `ontime` | `#067e3f` | `#005a29` | `#e5f5e8` | On schedule · seats available |
| `delay` | `#995700` | `#6e3c00` | `#feedd9` | Delayed · almost full |
| `issue` | `#be2323` | `#8b1113` | `#ffeae6` | Cancelled · sold out |
| `info` | `#6158bb` | `#443b8b` | `#eeefff` | Advisory · detour · notice |

**Do not re-tint these to match the brand.** They carry meaning, and that
meaning has to survive a re-brand. Colour is never the only signal either —
every pill carries a text label and a dot, so the interface still works in
greyscale and for colour-blind riders.

Two hues moved when the brand became blue:

- **Advisory left blue for indigo**, for the reason in §1.
- **Delay moved off hue 69** so it no longer sits on the gold accent. It is
  still unmistakably amber, and it is still 45° from `issue` red — the
  separation that actually matters, since those two are the pills that appear
  side by side.

### The same four states on dark ground

A status dot is only useful if it can be seen. The bases above are tuned
against their own pale fields and land at 2.8–3.3:1 on `--brand-950` — which
is the ground under the service banner, the departure board and the hero,
i.e. every place a rider looks for live state first.

```css
.on-dark {
  --status-ontime: #4fb772;   /* 6.8:1 on --brand-950 */
  --status-delay:  #e2832d;   /* 6.1:1 */
  --status-issue:  #ff655a;   /* 5.9:1 */
  --status-info:   #948ff7;   /* 6.1:1 */
}
```

Redefining the token inside `.on-dark` lifts all four without touching a
component, because `@theme inline` compiles `bg-ontime` straight to
`var(--status-ontime)`.

Delay is pushed 14° toward orange in this scale. At the gold end it would
otherwise sit on `--accent-400`, and **on a navy hero a warning that looks
like a call to action is worse than no warning at all.**

Pale-tint pills nested inside a dark section opt back out via `.status-field`
on the `StatusPill` wrapper — otherwise their dot and border would lift
against a field that did not move.

---

## 5. Neutrals — warm stone against a cool brand

```
--paper          #ffffff
--paper-sunken   #f7f5f1    alternating section bands
--ink            #15181d    body copy                       17.8:1
--ink-muted      #535961    secondary copy                   7.1:1
--ink-subtle     #6a7179    captions, labels, meta           4.9:1
--line           #e3e2de    decorative dividers
--line-strong    #95928f    interactive boundaries           3.1:1
```

The neutrals are warm on purpose. **Navy + warm stone + gold** is the palette
every heritage institution and park service converged on, and the warmth is
what stops a blue-heavy transit site reading cold and clinical.

Two fixes are baked in here and should not be undone:

**The ink hierarchy is three tiers, and has to stay three.** `--ink-muted` and
`--ink-subtle` had converged to `#5a6069` and `#5f6871` — a 0.5:1 difference,
i.e. two tokens doing one job and no visible distinction between secondary
copy and captions.

**`--line-strong` is the boundary of every input in the booking flow.** It was
`#cfcecb` — 1.62:1 on white, which fails WCAG 2.2 SC 1.4.11 for a UI component
boundary. It is now 3.09:1. This is not a cosmetic point: the booking form is
filled in outdoors, on a phone, in Banff daylight, and a field you cannot see
the edge of is a field people abandon.

---

## 6. The contrast contract

Every pair below is rendered by a real component and was verified before this
palette shipped. Re-run the check before changing any value.

| Pair | Need | Got |
| --- | --- | --- |
| `brand-700` text on paper (32 uses) | 4.5 | **8.16** |
| `brand-700` text on `brand-50` | 4.5 | **7.58** |
| `brand-600` text on paper | 4.5 | **6.13** |
| `brand-900` wordmark on paper | 7.0 | **13.43** |
| white on `brand-800` (18 uses) | 7.0 | **10.58** |
| white on `brand-900` / `brand-950` | 7.0 | **13.43 / 17.09** |
| `brand-200` on `brand-800` | 4.5 | **7.10** |
| `brand-400` border on paper (1.4.11) | 3.0 | **3.30** |
| `accent-500` fill + `ink` label (CTA) | 4.5 | **9.22** |
| `accent-400` text on `brand-800` | 4.5 | **6.50** |
| `accent-700` text on paper | 4.5 | **4.59** |
| `ink-muted` / `ink-subtle` on paper | 7.0 / 4.5 | **7.07 / 4.94** |
| `line-strong` on paper (1.4.11) | 3.0 | **3.09** |
| every status ink on its own field | 4.5 | **7.4 – 8.3** |
| every status dot on its own field | 3.0 | **4.6 – 5.3** |
| every status dot on `brand-950` (`.on-dark`) | 3.0 | **5.9 – 6.8** |

---

## 7. Applying it — the UI rules

**Roughly 60 / 30 / 10.** Warm paper is the ground, navy is the structure,
gold is the action. Gold above ~10% of a viewport stops reading as "press
this" and starts reading as decoration.

**Gold means one thing: the next step in booking.** Primary CTAs, the "Book a
seat" header button, the next-departure countdown, links out of the departure
board, the focus halo. It may never be used for a heading, a divider, a hover
state that isn't a CTA, or a service state.

**Navy sections set the page rhythm.** Hero (`-900`), comparison header
(`-800`), closing CTA (`-900`), footer (`-950`), service banner (`-950`).
Alternate them with paper and `--paper-sunken` so the eye resets; two dark
bands in a row makes the page feel like a brochure rather than a timetable.

**Every dark section gets `.on-dark`.** It swaps the focus ring to
white-on-navy and lifts the status scale. A dark section without it has an
invisible keyboard focus ring and unreadable status dots.

**Route roundels are `--brand-800` squircles with white tabular numerals.**
They are the closest thing this brand has to a mark, they appear at 32–44px in
five places, and they are what makes the operation look like a network rather
than a booking page. If per-route line colours are ever introduced, they must
be a *fourth* palette — not drawn from brand, accent or status — and every
route must still be identified by its number, not only by colour.

**The wordmark inverts, it does not recolour.** `--brand-900` on light,
white on dark. It is drawn in `currentColor` for exactly this reason.

**Photography direction.** Blue hour and first light, cool shadows, warm rim.
Avoid midday postcard saturation — it makes the turquoise fight the navy. The
two-axis `.scrim-photo` is tuned to a navy-black (`rgb(4 14 32)`), so images
composite into the brand rather than sitting on top of it.

---

## 8. Typography

| Role | Face | Why |
| --- | --- | --- |
| Display / headings | Source Serif 4 | Every established transit authority benchmarked uses a serif. It is the cheapest available signal that an operator has been running longer than one season. |
| Interface / body | Inter | Excellent at small sizes, and its tabular figures keep timetable columns aligned. |

Both load through `next/font/google`, so they self-host at build time — no
third-party request, no layout shift.

---

## 9. How to re-brand anyway

Edit **block 1 of `src/app/globals.css`**, then two files that cannot read CSS
variables:

| File | What to change |
| --- | --- |
| `src/app/layout.tsx` | `viewport.themeColor` — the mobile browser chrome. Use `--brand-800`. |
| `src/app/opengraph-image.tsx` | The four literal hexes at the top. Satori resolves no custom properties, so the social card keeps its own copy. |

### Validated alternates

Both are built on the same lightness ladder as Alpine Blue and clear the same
contrast contract, so they are genuine drop-ins.

**B. Spruce** — the national-park-authority direction. Highest instant
credibility in this market, lowest differentiation; closest to Roam and to
Parks Canada's own visual language. Note it collides with `--status-ontime`,
so if you take it, "on schedule" green has to move.

```css
--brand-50:  #f0f9f2;  --brand-100: #dcf0e0;  --brand-200: #b9dec1;
--brand-300: #8dc69c;  --brand-400: #589f6d;  --brand-500: #3b8955;
--brand-600: #257341;  --brand-700: #185f33;  --brand-800: #114c28;
--brand-900: #0a3a1d;  --brand-950: #052310;
```

**C. Graphite** — colour-neutral. Ages best, photographs best against real
mountain imagery, and lets the gold and the status scale do all the work.
Costs you a memory hook, which a first-season operator can least afford.

```css
--brand-50:  #f4f6f9;  --brand-100: #e6eaef;  --brand-200: #cdd4db;
--brand-300: #aeb7c0;  --brand-400: #858e98;  --brand-500: #6f7881;
--brand-600: #5b636c;  --brand-700: #4a5159;  --brand-800: #3a4047;
--brand-900: #2b3036;  --brand-950: #191d21;
```

---

## 10. Placeholder assets to replace before launch

| Asset | Where | Note |
| --- | --- | --- |
| Hero backdrop | `src/components/brand/alpine-scene.tsx` | A drawn SVG, not a photograph. Replace with a licensed or commissioned image behind the same `.scrim-photo`. Do **not** reuse a competitor's photography. |
| Wordmark | `src/components/brand/logo.tsx` | Drawn in `currentColor`, no baked-in hex. Swap for the real mark. |
| Company name | `src/config/site.ts` | "Larch Line" is a placeholder — see the note in that file. |
| Credentials | `src/config/site.ts` → `credentials` | NSC number, Parks Canada licence, liability cover, named operator. For a first-season operator these do more trust work than a star rating would. |
