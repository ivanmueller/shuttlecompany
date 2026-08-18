import { FlagshipRouteCard, routeBySlug } from "shuttlecompany";

/**
 * The emphasised variant of `RouteCard`, used once per page for the route that
 * carries the most demand.
 *
 * Use it for the one route the page is about; a grid where every card is a
 * flagship has no hierarchy left to spend.
 */
export function MoraineLakeExpress() {
  return <FlagshipRouteCard route={routeBySlug("moraine-lake-express")!} />;
}

export function LakeLouiseLakeshore() {
  return <FlagshipRouteCard route={routeBySlug("lake-louise-lakeshore-shuttle")!} />;
}
