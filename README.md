# Larch Line — Banff & Lake Louise shuttle

A booking and content site for a scheduled shuttle operator in Banff National
Park, positioned to absorb the demand that the Parks Canada shuttle and Roam
Transit cannot serve.

> **Larch Line is a placeholder name**, as is every phone number, fare and
> statistic in `src/config/site.ts`. See [Before you launch](#before-you-launch).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · zero runtime
dependencies beyond `clsx`/`tailwind-merge`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 33 static pages
npm run lint
```

## How it is organised

```
src/
  config/site.ts        Brand identity, contact details, season, competitor benchmarks
  data/
    network.ts          Stops, routes, fares, timetable generation  ← the source of truth
    faqs.ts             30 answers, reused as on-page content and FAQPage schema
    landing-pages.ts    Keyword landing pages, as data
    comparison.ts       The competitor comparison table
    legal.ts            Terms, privacy, accessibility (drafts)
  lib/schema.ts         All JSON-LD generators
  components/           UI, grouped by concern
  app/                  Routes
```

`network.ts` is the single source of truth. The timetables, the booking
search, the route pages, the home page departure board, the sitemap and the
`BusTrip` structured data are all derived from it, so a schedule change is a
one-file edit and cannot drift between the marketing copy and the booking
engine.

## The commercial thesis, in three parts

**1. Frequency is the product.** Parks Canada allocates a fixed number of
seats through a reservation lottery; Roam's Lake Louise express is sold out
for most of the summer. Neither can absorb same-day demand. Every page leads
with headway ("every 20 minutes") rather than with price or scenery, because
availability is the thing the competition cannot match.

**2. The funnel starts above the fold.** The booking search is the first
interactive element on the home page, following Ember rather than the
tour-operator pattern used by Moraine Lake Bus Company, which pushes its
booking action two screens down.

**3. The keyword pages are the acquisition channel.** Someone searching
"parks canada shuttle" is not looking for us — they are looking for Parks
Canada, will find it sold out, and then need somewhere to go next. The pages
in `landing-pages.ts` are that somewhere, and they answer the query honestly
including where the honest answer is "book the competitor".

## SEO implementation

| Surface | Where |
| --- | --- |
| Per-page metadata + canonicals | `generateMetadata` in each route |
| `TouristInformationCenter`, `WebSite` | `app/layout.tsx` |
| `BusTrip` + `Offer` per route | `app/routes/[slug]/page.tsx` |
| `FAQPage` | Home, FAQ, route and landing pages |
| `BreadcrumbList` | Every interior page |
| `Article` | Landing pages, with `dateModified` |
| `sitemap.xml`, `robots.txt` | `app/sitemap.ts`, `app/robots.ts` |
| OG image | `app/opengraph-image.tsx`, generated from live timetable data |

The booking funnel is `noindex` and disallowed in robots.txt — its query
strings would otherwise generate thousands of near-duplicate URLs and consume
crawl budget that belongs to the route and keyword pages.

`AggregateRating` is **deliberately suppressed** until
`site.proof.verified` is true. Publishing an unsubstantiated rating is a
manual-action risk in Google Search and a misleading-advertising risk under
the Competition Act.

## Conversion decisions worth keeping

Each of these is a deliberate choice, not an accident of implementation:

- **Search above the fold**, with every field pre-filled so "Find departures"
  is reachable in one tap.
- **The CTA accent is not the brand colour**, so a primary button never
  disappears into a brand-coloured section.
- **Scarcity only where it is true.** Above eight seats the interface says
  nothing rather than manufacturing urgency; a fake "only 3 left!" on every
  row trains riders to ignore it.
- **Sold-out departures stay visible**, greyed. Seeing that 9:00 and 9:20 are
  gone is what makes 9:40 feel urgent.
- **The comparison table concedes a row.** Parks Canada is genuinely cheaper
  and the table says so. A table where the challenger wins every line is read
  as marketing and discounted entirely.
- **The confirmation page is treated as a conversion surface**, not a receipt:
  it prevents no-shows with a pre-departure checklist and offers the second
  lake while intent is highest.
- **Persistent mobile CTA** that re-enters after the hero, suppressed inside
  the funnel where a competing action costs more than it earns.

## Accessibility

Targets WCAG 2.2 AA. Timetables are real `<table>` elements with scoped
headers and captions; the FAQ uses native `<details>` so answers are in the
DOM for crawlers and find-in-page works; every interactive element has a
visible focus ring; status is never conveyed by colour alone; `prefers-reduced-motion`
is honoured.

## Deploying

Hosted on **Vercel**, with DNS on **Cloudflare**.

### First deploy

1. [vercel.com/new](https://vercel.com/new) → import `ivanmueller/shuttlecompany`.
2. Change nothing. Vercel detects Next.js and the defaults are correct.
3. Deploy. You get a live `*.vercel.app` URL in about two minutes.

Every push to `main` redeploys production. **Every branch and every pull
request gets its own preview URL**, which is the fastest way to review a
change before it goes live.

### Attaching a subdomain

In Vercel: **Project → Settings → Domains → Add**, enter e.g.
`shuttle.yourdomain.com`. Vercel shows you a DNS record to create.

In Cloudflare DNS, add that record — normally:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `shuttle` | `cname.vercel-dns.com` | **DNS only** |

> **The proxy must be off.** Cloudflare's orange cloud in front of Vercel
> causes SSL handshake failures or redirect loops, and it is the single most
> common reason a Vercel custom domain never goes green. Click the orange
> cloud so it turns grey. Certificates issue within a minute or two.

Then set the canonical URL so metadata, the sitemap and the structured data
all point at the real domain — **Settings → Environment Variables**:

```
NEXT_PUBLIC_SITE_URL = https://shuttle.yourdomain.com
```

Redeploy for it to take effect. Until you set it, the site falls back to the
Vercel production domain automatically, so canonicals are never wrong — just
not yet on your domain.

### What is already handled

- **Preview deploys are `noindex` and `Disallow: /`.** Vercel preview URLs are
  routinely discovered and indexed, which would put duplicate copies of the
  keyword pages in the index and compete with the real site. Both the meta tag
  and robots.txt switch automatically on `NEXT_PUBLIC_VERCEL_ENV`.
- **ISR.** The home page revalidates every 10 minutes, route pages every 10,
  service status every 5. The departure board and seat availability stay
  current without a rebuild.
- **Response headers** are declared in `next.config.ts`.

### Not GitHub Pages

This was briefly configured for static export and reverted. A static host
cannot do incremental revalidation — the "live" departure board would freeze
at build time — and cannot process a payment server-side. `next.config.ts`
documents the exact changes if a static host is ever required.

## Before you launch

This is a complete, working front end. These things are **not** done and
must be, in roughly this order:

1. **Payments.** `src/components/booking/checkout-client.tsx` simulates a
   successful authorisation. The card fields are inert placeholders that
   collect nothing. Replace `submit` with a server action creating a Stripe
   PaymentIntent and mount Stripe Elements.
2. **Real inventory.** `getDepartures` in `network.ts` generates deterministic
   pseudo-availability from a hash so it is stable across renders and does not
   cause hydration mismatches. Replace `seatsRemaining` with a live inventory
   call; the display components already treat it as untrusted.
3. **Legal review.** `src/data/legal.ts` contains structured drafts, not legal
   advice. The terms of carriage in particular carry real liability exposure
   for a passenger carrier operating in a national park.
4. **Verify every claim.** Fares, frequencies, the on-time rate, the review
   count, competitor pricing in `site.benchmarks`, and the operating-authority
   line in the footer. Comparative advertising is legal in Canada and converts
   well, but s.52 of the Competition Act applies to a comparison table exactly
   as it applies to a headline price. Re-check competitor details each season.
5. **Brand decision.** See [`docs/BRAND.md`](docs/BRAND.md). Three
   ready-to-paste alternate palettes are documented there.
6. **Real photography.** The hero is a drawn SVG placeholder. Commission or
   licence images — do not reuse a competitor's, which are rights-managed.
7. **Analytics and consent.** Nothing is instrumented yet. Whatever goes in
   needs a PIPEDA-compliant consent path, and the privacy policy needs to
   match what actually gets collected.
