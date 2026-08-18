import { BlockRenderer, landingPageBySlug } from "shuttlecompany";

/**
 * Renders a landing page's body from its `Block[]` data — prose, lists,
 * tables, callouts, embedded timetables, route grids and FAQ pulls.
 *
 * Keyword pages are data, not markup, which is what keeps thirty of them
 * consistent. Add a block type here rather than hand-writing a page.
 */
const moraine = landingPageBySlug("moraine-lake-shuttle")!;
const parksCanada = landingPageBySlug("parks-canada-shuttle-alternative")!;

export function ProseAndLists() {
  return <BlockRenderer blocks={moraine.blocks.slice(0, 3)} />;
}

/** The block types that carry structure — tables and callouts. */
export function TablesAndCallouts() {
  return (
    <BlockRenderer
      blocks={parksCanada.blocks
        .filter((b) => b.type === "table" || b.type === "callout")
        .slice(0, 3)}
    />
  );
}

/** Every callout tone, which is how advisories are graded on a page. */
export function CalloutTones() {
  return (
    <BlockRenderer
      blocks={[
        {
          type: "callout",
          tone: "info",
          heading: "Larch season books out",
          body: "Late September is the busiest fortnight of the year. Seats are still released daily, but the early departures go first.",
        },
        {
          type: "callout",
          tone: "ontime",
          heading: "Running to schedule",
          body: "All routes are operating normally today.",
        },
        {
          type: "callout",
          tone: "delay",
          heading: "Moraine Lake Road is slow",
          body: "Expect ten to fifteen minutes of extra running time this afternoon.",
        },
        {
          type: "callout",
          tone: "issue",
          heading: "Road closed",
          body: "Moraine Lake Road is closed by Parks Canada. Lake Louise departures are unaffected.",
        },
      ]}
    />
  );
}
