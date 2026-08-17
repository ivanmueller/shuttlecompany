import { cn } from "@/lib/utils";
import type { ServiceStatus } from "@/data/network";

/**
 * Transit status indicator.
 *
 * Colour follows the convention riders already know from platform displays —
 * green on schedule, amber delayed, red disrupted — and is deliberately
 * independent of the brand palette so it survives a re-brand.
 *
 * Colour is never the only carrier of meaning: every pill has a text label
 * and a dot, so it reads correctly for colour-blind riders and in screenshots.
 */

const tone: Record<
  ServiceStatus | "info",
  { wrap: string; dot: string; defaultLabel: string }
> = {
  ontime: {
    wrap: "bg-ontime-bg text-ontime-ink border-ontime/25",
    dot: "bg-ontime",
    defaultLabel: "On schedule",
  },
  delay: {
    wrap: "bg-delay-bg text-delay-ink border-delay/25",
    dot: "bg-delay",
    defaultLabel: "Minor delay",
  },
  issue: {
    wrap: "bg-issue-bg text-issue-ink border-issue/25",
    dot: "bg-issue",
    defaultLabel: "Service alert",
  },
  info: {
    wrap: "bg-info-bg text-info-ink border-info/25",
    dot: "bg-info",
    defaultLabel: "Advisory",
  },
};

export function StatusPill({
  status,
  label,
  className,
  size = "md",
}: {
  status: ServiceStatus | "info";
  label?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const t = tone[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[0.6875rem]" : "px-2.5 py-1 text-xs",
        t.wrap,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", t.dot)} />
      {label ?? t.defaultLabel}
    </span>
  );
}

/**
 * Seat availability, expressed the way it actually converts.
 *
 * Scarcity only works when it is true. The thresholds below map to real
 * inventory, and above 8 seats we say nothing rather than manufacturing
 * urgency — a fake "only 3 left!" on every row trains riders to ignore it.
 */
export function SeatsPill({
  seats,
  capacity,
  className,
}: {
  seats: number;
  capacity: number;
  className?: string;
}) {
  if (seats === 0) {
    return <StatusPill status="issue" label="Sold out" size="sm" className={className} />;
  }
  if (seats <= 4) {
    return (
      <StatusPill
        status="delay"
        label={`Only ${seats} seat${seats === 1 ? "" : "s"} left`}
        size="sm"
        className={className}
      />
    );
  }
  if (seats <= 8) {
    return (
      <StatusPill status="delay" label={`${seats} seats left`} size="sm" className={className} />
    );
  }
  if (seats >= capacity * 0.75) {
    return <StatusPill status="ontime" label="Wide open" size="sm" className={className} />;
  }
  return <StatusPill status="ontime" label="Seats available" size="sm" className={className} />;
}
