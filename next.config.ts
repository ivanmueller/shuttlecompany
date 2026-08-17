import type { NextConfig } from "next";

/**
 * Vercel deployment.
 *
 * Deliberately close to the defaults: Vercel detects Next.js and wires up
 * builds, ISR, image optimisation and the CDN with no configuration. The only
 * additions here are response headers, which have to be declared somewhere and
 * belong with the app rather than in a dashboard nobody reads.
 *
 * NOTE ON STATIC HOSTS
 * --------------------
 * This project was briefly configured for `output: "export"` (GitHub Pages)
 * and then reverted, because a static host cannot run the two things this
 * business needs: incremental revalidation, which is what keeps the departure
 * board and timetables current without a rebuild, and server-side payment
 * handling. If a static host is ever required again, the changes are:
 * `output: "export"`, delete every `export const revalidate`, drop the
 * `headers()` block below (unsupported), and set `images.unoptimized`.
 */
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          /* Stops browsers from second-guessing a declared content type. */
          { key: "X-Content-Type-Options", value: "nosniff" },
          /* Send the origin cross-site so competitor referral data stays
             useful to us, without leaking a visitor's full booking URL. */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          /* Nothing here should ever be framed by another site. */
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
