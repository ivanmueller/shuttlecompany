import { HeaderNav, routes } from "shuttlecompany";

/**
 * The navigation bar inside `SiteHeader`. It is exported separately so a
 * landing page can mount navigation without the rest of the masthead.
 *
 * `routes` drives the "Routes & schedules" menu, so it stays in step with the
 * network data rather than a hand-kept list. Below the `lg` breakpoint the
 * inline links collapse behind a menu button — that drawer is interaction-only
 * and does not appear in a static card.
 */
export function Default() {
  return (
    <HeaderNav
      routes={routes.map((r) => ({ id: r.id, number: r.number, slug: r.slug, name: r.name }))}
      tollFree="+1-833-555-0142"
      tollFreeDisplay="1-833-555-0142"
    />
  );
}
