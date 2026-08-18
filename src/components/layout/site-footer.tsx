import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { site } from "@/config/site";
import { routes, totalDailyDepartures } from "@/data/network";

/**
 * Footer.
 *
 * Doing three jobs at once: internal linking for the keyword pages (crawl
 * depth on this site is never more than two clicks), the legal and contact
 * signals that make an unfamiliar operator feel safe to pay, and a last-chance
 * CTA for the long-scroll visitors.
 */

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Plan your trip",
    links: [
      { href: "/routes", label: "All routes & schedules" },
      { href: "/fares", label: "Fares & passes" },
      { href: "/service-status", label: "Live service status" },
      { href: "/stops", label: "Stops & parking" },
      { href: "/book", label: "Book a seat" },
    ],
  },
  {
    title: "Where we go",
    links: [
      { href: "/moraine-lake-shuttle", label: "Moraine Lake shuttle" },
      { href: "/lake-louise-shuttle", label: "Lake Louise shuttle" },
      { href: "/banff-to-lake-louise-bus", label: "Banff to Lake Louise bus" },
      { href: "/moraine-lake-sunrise", label: "Moraine Lake sunrise" },
      { href: "/canmore-to-lake-louise", label: "Canmore to Lake Louise" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/parks-canada-shuttle-alternative", label: "vs Parks Canada shuttle" },
      { href: "/roam-transit-alternative", label: "vs Roam Transit" },
      { href: "/how-to-get-to-moraine-lake", label: "Every way to reach Moraine Lake" },
      { href: "/no-reservation", label: "Missed the reservation window?" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/terms", label: "Terms & conditions" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-brand-950 text-white/75">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.4fr)]">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              A scheduled shuttle service for Banff National Park, running{" "}
              <strong className="font-semibold text-white">
                {totalDailyDepartures()} departures a day
              </strong>{" "}
              across {routes.length} routes so that visitors who could not get a
              Parks Canada or Roam Transit reservation can still reach the lakes.
            </p>

            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-white/50">Toll free</dt>
                <dd>
                  <a
                    href={`tel:${site.contact.tollFree}`}
                    className="inline-block py-1 font-semibold text-white hover:underline"
                  >
                    {site.contact.tollFreeDisplay}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-white/50">Local</dt>
                <dd>
                  <a href={`tel:${site.contact.phone}`} className="inline-block py-1 hover:underline">
                    {site.contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-white/50">Email</dt>
                <dd>
                  <a href={`mailto:${site.contact.email}`} className="inline-block py-1 hover:underline">
                    {site.contact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block py-1 hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Land acknowledgement. Every credible operator in the Bow Valley
            carries one; its absence is conspicuous to local partners. */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-white/50">
            {site.legalName} operates on Treaty 7 territory, the traditional lands of the
            Stoney Nakoda Nations (Chiniki, Bearspaw and Goodstoney), the Tsuut&apos;ina
            Nation and the Blackfoot Confederacy (Siksika, Kainai and Piikani), and the
            Métis Nation of Alberta, Region 3.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {site.season.year} {site.legalName}. Not affiliated with Parks Canada,
              Roam Transit or Moraine Lake Bus Company.
              {/* Attribution for the hero photograph. Most stock licences and
                  every Creative Commons licence require a visible credit; it
                  renders only when site.heroPhoto.credit is set. */}
              {site.heroPhoto?.credit ? ` Hero photograph ${site.heroPhoto.credit}.` : ""}
            </p>
            {/* This used to read "Licensed intra-provincial passenger carrier
                · Alberta Transportation · Operating authority pending", which
                contradicts itself inside one sentence — you cannot be a
                licensed carrier with your authority pending — and, read
                plainly, told a paying visitor we are not permitted to run
                buses. Credentials now render from config only once they are
                real, and say nothing until then. */}
            {site.credentials.nscNumber ? (
              <p>
                Licensed intra-provincial passenger carrier · Alberta Transportation ·
                NSC {site.credentials.nscNumber}
              </p>
            ) : (
              <p>{site.legalName} · {site.address.locality}, {site.address.region}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
