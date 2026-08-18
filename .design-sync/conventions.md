# Building with Larch Line

A transit booking and marketing system for a Banff shuttle operator. Components
are React, styled with Tailwind v4 utilities over a token layer. Read this
before writing a screen.

## Setup: none

There is no provider, theme wrapper or context to mount. Every component is
self-contained and reads brand, contact, fare and season values from the site
config already inside the bundle. Render one and it is correct.

Two things the stylesheet does for you, so do not re-declare them: **Inter**
(body) and **Source Serif 4** (display) are bundled and bound to `--font-body` /
`--font-display`, and `:root` carries the whole token layer.

## The one contract that bites

Components that render white type — `HeroPlanner`, and your own copy over
`Section tone="brand"` — only read on a dark ground. Mount them inside the hero
shell, or the headline renders white-on-white and disappears:

```jsx
<section className="on-dark relative isolate overflow-hidden bg-brand-900">
  <HeroBackdrop />
  <div className="absolute inset-0 scrim-photo" aria-hidden />
  <div className="container-page relative py-14">{/* white-type content */}</div>
</section>
```

`on-dark` re-tones focus rings and status fields for a dark background. Use
`Section tone="brand"` when you just need a dark band and no backdrop art.

## Styling idiom: Tailwind utilities, project tokens

Write ordinary Tailwind for layout (`flex`, `grid`, `gap-6`, `py-16`). For
anything that carries the brand, use these families — **never** a stock Tailwind
palette like `bg-blue-800` or `text-slate-500`, which is not the brand and does
not survive a re-brand:

| Family | Classes | Use for |
| --- | --- | --- |
| Brand | `{bg,text,border,ring,divide}-brand-{50…950}` | Navy identity: headers, footers, dark bands |
| Accent | `{bg,text,border}-accent-{400,500,600,700}` | Larch gold. **CTAs only** |
| Surface | `bg-paper`, `bg-sunken` | Page ground; `sunken` is the alternating band |
| Ink | `text-ink`, `text-ink-muted`, `text-ink-subtle` | Body copy hierarchy |
| Rules | `border-line`, `border-line-strong`, `divide-line` | Hairlines and dividers |
| Status | `{bg,text,border}-{ontime,delay,issue,info}` plus `-bg` / `-ink` variants | Service state only |
| Type | `font-display` (serif headings), `font-sans` | The type ramp |
| Shape | `rounded-card`, `shadow-card`, `shadow-lift` | Card treatment |
| Layout | `container-page` | The centred page gutter — use on every section |
| Numerals | `tabular` | Times, fares, seat counts |

The status scale is **semantic, never decorative**: `ontime` green, `delay`
amber, `issue` red, `info` indigo. Do not reach for it to add colour, and never
let colour be the only carrier of meaning — pair it with a label, as
`StatusPill` and `SeatsPill` do.

**The primary CTA is gold, not brand.** `Button variant="primary"` is
`accent-500` precisely so it never disappears inside a brand-coloured section.
Do not "fix" a gold button on navy.

## Data lives in the bundle

Do not invent transit data. `routes`, `stops`, `getDepartures`, `routeBySlug`,
`stopById`, `faqs`, `featuredFaqs`, `landingPages`, `comparisonRows`,
`todayISO`, `formatDateShort` and `formatCad` all ship alongside the components
and are what `Timetable`, `RouteCard`, `DepartureBoard` and `FaqAccordion`
expect. `Route` objects come from `routes` — never hand-built.

## Where the truth is

`styles.css` and its imports are the real stylesheet — read it when a token name
is in doubt. Each component's `.d.ts` is its prop contract and its
`.prompt.md` shows composition. Prefer reading those over guessing.

## A screen, idiomatically

```jsx
<Section tone="sunken">
  <SectionHeading
    eyebrow="Every 20 minutes"
    title="Seats released daily"
    lede="Travel when the Parks Canada lottery is sold out."
  />
  <div className="mt-10 grid gap-5 sm:grid-cols-2">
    {routes.slice(0, 4).map((route) => (
      <RouteCard key={route.slug} route={route} />
    ))}
  </div>
  <div className="mt-10 flex items-center gap-3">
    <ButtonLink href="/book">Book a seat</ButtonLink>
    <span className="text-sm text-ink-muted tabular">$29 round trip</span>
  </div>
</Section>
```

Library components carry the design language; your own glue is Tailwind plus the
token families above.
