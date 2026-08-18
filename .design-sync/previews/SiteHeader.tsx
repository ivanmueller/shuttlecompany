import { SiteHeader } from "shuttlecompany";

/**
 * The site masthead — wordmark, primary navigation, phone number and the
 * booking CTA. It sources its own routes and contact details from the site
 * config, so it takes no props.
 *
 * Below the `lg` breakpoint the inline nav collapses to a drawer behind a menu
 * button; render this card wide to see the full desktop bar.
 */
export function Default() {
  return <SiteHeader />;
}
