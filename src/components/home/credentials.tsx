import { site } from "@/config/site";

/**
 * Who we are.
 *
 * The home page previously carried no third-party validation of any kind: no
 * reviews, no ratings, no named humans, no credentials. Gating
 * `aggregateRating` behind a verification flag was the right call — publishing
 * 1,284 invented reviews is a manual-action risk in Search and a Competition
 * Act problem — but the consequence was a page whose only proof was its own
 * assertions about itself.
 *
 * These are the signals a pre-review operator can honestly show. Every one is
 * verifiable, none requires a single customer, and together they answer "is
 * this a real bus company?" more convincingly than four stars would.
 *
 * Each item renders only when the corresponding value is set in
 * `config/site.ts`, so the site can never claim a licence it does not hold.
 * The fallback is a plain statement of what is still in progress — which is a
 * better trust signal than a decorative badge, and it is true.
 */
export function Credentials() {
  const { credentials } = site;

  const items = [
    credentials.nscNumber && {
      label: "Safety fitness certificate",
      value: `NSC ${credentials.nscNumber}`,
      note: "Alberta commercial carrier registration, verifiable with Alberta Transportation.",
    },
    credentials.parksCanadaLicence && {
      label: "Parks Canada business licence",
      value: credentials.parksCanadaLicence,
      note: "Required to operate commercially inside Banff National Park.",
    },
    credentials.liabilityCoverCad && {
      label: "Public liability cover",
      value: new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      }).format(credentials.liabilityCoverCad),
      note: "Certificate of insurance available on request.",
    },
    {
      label: "Registered operator",
      value: site.legalName,
      note: `${site.address.street}, ${site.address.locality}, ${site.address.region}. Reachable on ${site.contact.tollFreeDisplay} during service hours.`,
    },
  ].filter(Boolean) as { label: string; value: string; note: string }[];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
          Who you&apos;re booking with
        </p>
        <h2 className="text-3xl font-bold text-ink md:text-[2.25rem] md:leading-[1.12]">
          A licensed carrier, not a booking page
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-muted">
          We&apos;re new, and we&apos;d rather show you the paperwork than a star rating
          we haven&apos;t earned yet.
          {credentials.operatorName
            ? ` ${site.name} is run by ${credentials.operatorName}.`
            : ""}
        </p>
      </div>

      <div>
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-subtle">
              {item.label}
            </dt>
            <dd className="mt-1.5 font-sans text-[1.0625rem] font-bold text-ink">
              {item.value}
            </dd>
            <dd className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">
              {item.note}
            </dd>
          </div>
        ))}

        </dl>

        {!credentials.nscNumber && (
          <p className="mt-6 rounded-[var(--radius)] border border-line bg-sunken px-4 py-3 text-[0.875rem] leading-relaxed text-ink-muted">
            Our safety fitness certificate and Parks Canada operating licence are
            published here the day they are issued. Until then, nothing is charged
            until a departure is confirmed.
          </p>
        )}
      </div>
    </div>
  );
}
