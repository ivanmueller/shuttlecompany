import { RouteCard, routes, routeBySlug } from "shuttlecompany";

/**
 * The route summary card used on the routes index and in "related routes"
 * blocks: number, name, headway, service window and fare.
 *
 * It leads with frequency rather than scenery — every competitor sells these
 * as tours with a hero photo, and headway is the thing they cannot match.
 */
export function Flagship() {
  return <RouteCard route={routeBySlug("moraine-lake-express")!} />;
}

/** A connector route — longer headway, different service window. */
export function Connector() {
  return <RouteCard route={routeBySlug("banff-lake-louise-connector")!} />;
}

/** In the grid the routes index actually renders. */
export function Grid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {routes.slice(0, 4).map((route) => (
        <RouteCard key={route.slug} route={route} />
      ))}
    </div>
  );
}
