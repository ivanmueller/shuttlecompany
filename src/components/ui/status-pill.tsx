import { cn } from "@/lib/utils";
import type { Availability, ServiceStatus } from "@/data/network";
import { site } from "@/config/site";

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
        "status-field inline-flex items-center gap-1.5 rounded-full border font-semibold",
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
 * Two rules, both learned the expensive way:
 *
 *  1. **No numbers we cannot substantiate.** While `site.inventoryIsLive` is
 *     false the seat counts come from a hash of route + date + time, not from
 *     inventory. Rendering "Only 3 seats left" from that is a Competition Act
 *     s.74.01 exposure and — worse for a challenger whose whole pitch is
 *     honesty — a screenshot waiting to happen. Qualitative states are true
 *     either way, so those are what ship until the backend exists.
 *  2. **Amber means act now.** It is the alarm colour everywhere else on this
 *     site. It used to fire at eight seats or fewer, which on a 24-seat coach
 *     is a healthy bus and lit roughly one row in seven. A signal that common
 *     is not a signal.
 */
export function SeatsPill({
  availability,
  seats,
  className,
}: {
  availability: Availability;
  /** Only rendered when inventory is live. */
  seats?: number;
  className?: string;
}) {
  if (availability === "sold-out") {
    return <StatusPill status="issue" label="Sold out" size="sm" className={className} />;
  }

  if (availability === "limited") {
    return (
      <StatusPill
        status="delay"
        label={
          site.inventoryIsLive && typeof seats === "number"
            ? `Only ${seats} seat${seats === 1 ? "" : "s"} left`
            : "Almost full"
        }
        size="sm"
        className={className}
      />
    );
  }

  return (
    <StatusPill
      status="ontime"
      label={availability === "wide-open" ? "Wide open" : "Seats available"}
      size="sm"
      className={className}
    />
  );
}
