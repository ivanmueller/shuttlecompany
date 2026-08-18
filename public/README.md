# Static assets

Files here are served from the site root: `public/hero.jpg` → `/hero.jpg`.

## The hero photograph

`src/config/site.ts` → `heroPhoto` already points at **`/hero-lake-louise.jpg`**.
Drop the file in at exactly that name and the hero swaps from the drawn
`AlpineScene` to the photograph on the next build. Nothing else to edit.

If the file is missing, the hero falls back to the drawn scene rather than
rendering a broken image — so a missing upload degrades quietly instead of
shipping a hole in the most important screen on the site.

| Requirement | Value |
| --- | --- |
| Filename | `hero-lake-louise.jpg` |
| Width | ≥ 2400px (3000px is better; Next generates every size down from there) |
| Aspect | 16:9 or wider preferred. Narrower works — it is cropped vertically, see `focus` |
| Format | JPEG or WebP. Next re-encodes to AVIF/WebP per browser, so the source only needs to be good |
| Weight | Under 400 kB after export. The optimiser handles delivery, but the source still has to be fetched at build |

Use a different filename and you have to change `site.heroPhoto.src` to match.

## Cropping

`heroPhoto.focus` is the CSS `object-position`. The hero is much wider than
tall, so a 3:2 or 4:3 source is cropped **vertically** — the Y value is the one
that does the work, and a lower percentage keeps more of the top of the frame.

`"50% 35%"` is set for the current image: it keeps the ridgeline and the
boathouse band and crops the foreground out from under the four-stat row.
