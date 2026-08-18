import { SiteFooter } from "shuttlecompany";

/**
 * The site footer: route index, support links, operating-authority line and
 * the legal navigation. Like the header it reads the site config directly and
 * takes no props.
 *
 * The operating-authority line is a compliance surface, not decoration — it
 * names the licensed carrier behind the service.
 */
export function Default() {
  return <SiteFooter />;
}
