import { PageHeader, ButtonLink } from "shuttlecompany";

/**
 * The masthead every interior page opens with: breadcrumbs, an optional
 * eyebrow, the H1 and a lede. Anything passed as children sits under the lede,
 * which is where the page's primary action goes.
 *
 * `breadcrumbs` should NOT include a leading "Home" — the component prepends
 * its own, and passing one renders the crumb twice.
 */
export function WithBreadcrumbs() {
  return (
    <PageHeader
      eyebrow="Route 1"
      title="Moraine Lake Express"
      lede="Every 20 minutes from Lake Louise Village, 5:30 am to 8:00 pm. $29 round trip with an open return."
      breadcrumbs={[
        { name: "Routes & schedules", path: "/routes" },
        { name: "Moraine Lake Express", path: "/routes/moraine-lake-express" },
      ]}
    />
  );
}

/** With a call to action underneath — the form the route pages use. */
export function WithAction() {
  return (
    <PageHeader
      eyebrow="Fares"
      title="What a seat costs"
      lede="One price, both directions, no booking fee."
      breadcrumbs={[
        { name: "Fares", path: "/fares" },
      ]}
    >
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/book">Book a seat</ButtonLink>
        <ButtonLink href="/routes" variant="outline">See all routes</ButtonLink>
      </div>
    </PageHeader>
  );
}

/** The minimum: a title and nothing else. */
export function TitleOnly() {
  return <PageHeader title="Service status" />;
}
