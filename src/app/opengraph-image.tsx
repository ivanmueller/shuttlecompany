import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { routes, totalDailyDepartures } from "@/data/network";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card.
 *
 * Generated rather than designed in Figma so it re-brands with the palette and
 * never goes stale against the timetable — the departure count in the corner
 * is read from the same data the site runs on.
 *
 * Colours are literal here because Satori resolves no CSS custom properties.
 * They mirror the --brand-* tokens in globals.css; update both together.
 */
const BRAND_950 = "#16242d";
const BRAND_800 = "#2c414e";
const BRAND_200 = "#b8d4da";
const ACCENT_400 = "#f5c451";

export default function OpengraphImage() {
  const fastest = routes.reduce((a, b) =>
    a.headwayMinutes <= b.headwayMinutes ? a : b,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${BRAND_950} 0%, ${BRAND_800} 100%)`,
          padding: 72,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              border: `3px solid ${BRAND_200}`,
              fontSize: 30,
              fontWeight: 700,
              color: BRAND_200,
            }}
          >
            ↑
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
              {site.name}
            </span>
            <span
              style={{
                fontSize: 15,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: BRAND_200,
              }}
            >
              Banff · Lake Louise
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 900,
            }}
          >
            Moraine Lake &amp; Lake Louise,
            <br />
            <span style={{ color: ACCENT_400 }}>without a reservation</span>
          </span>
          <span style={{ fontSize: 27, color: "rgba(255,255,255,0.78)", maxWidth: 850 }}>
            A bus every {fastest.headwayMinutes} minutes. Seats released daily.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 56,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 28,
          }}
        >
          {[
            [String(totalDailyDepartures()), "departures daily"],
            [String(routes.length), "routes"],
            ["$12+", "one-way fares"],
            [site.season.label.split(",")[0], "operating season"],
          ].map(([value, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 34, fontWeight: 700 }}>{value}</span>
              <span style={{ fontSize: 17, color: "rgba(255,255,255,0.6)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
