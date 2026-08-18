import { StatusPill } from "shuttlecompany";

/**
 * Transit status indicator, following the convention riders already read on
 * platform displays: green on schedule, amber delayed, red disrupted, indigo
 * advisory.
 *
 * The scale is deliberately independent of the brand palette so it survives a
 * re-brand, and colour is never the only carrier of meaning — every pill has a
 * dot and a text label.
 */
export function Statuses() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusPill status="ontime" />
      <StatusPill status="delay" />
      <StatusPill status="issue" />
      <StatusPill status="info" label="Advisory" />
    </div>
  );
}

/** Each status takes a custom label when the default is too generic. */
export function CustomLabels() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusPill status="ontime" label="Running to schedule" />
      <StatusPill status="delay" label="10 min behind" />
      <StatusPill status="issue" label="Moraine Lake Road closed" />
      <StatusPill status="info" label="Larch season — book ahead" />
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusPill status="ontime" size="sm" />
      <StatusPill status="ontime" size="md" />
      <StatusPill status="delay" size="sm" />
      <StatusPill status="delay" size="md" />
    </div>
  );
}
