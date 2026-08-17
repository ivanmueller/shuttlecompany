import { AlpineScene } from "@/components/brand/alpine-scene";
import { SearchWidget } from "@/components/booking/search-widget";
import { routes, totalDailyDepartures } from "@/data/network";
import { site } from "@/config/site";

/**
 * Hero.
 *
 * The structural bet, taken from Ember: the booking search is above the fold
 * and is the first thing a visitor can touch. Moraine Lake Bus Company puts a
 * photograph and a review badge there and pushes the booking action two
 * screens down; that costs them every visitor who arrived ready to buy.
 *
 * The headline names the destination rather than the company, because that is
 * what the visitor typed into Google and matching their words is worth more
 * than brand-building on a first visit.
 */
export function Hero() {
  const fastest = routes.reduce((a, b) => (a.headwayMinutes <= b.headwayMinutes ? a : b));

  return (
    <section className="relative isolate overflow-hidden bg-brand-900">
      <AlpineScene className="absolute inset-0 size-full" />
      <div className="absolute inset-0 scrim-photo" aria-hidden />

      <div className="container-page relative pb-8 pt-14 md:pb-12 md:pt-20">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <span aria-hidden className="size-1.5 rounded-full bg-ontime" />
            Seats released daily · No reservation lottery
          </p>

          <h1 className="text-on-photo text-[2.5rem] font-bold leading-[1.06] text-white sm:text-5xl md:text-[3.5rem]">
            Get to Moraine Lake and Lake Louise{" "}
            <span className="text-accent-400">without a reservation</span>
          </h1>

          <p className="text-on-photo mt-5 max-w-xl text-lg leading-relaxed text-white/90">
            Parks Canada and Roam Transit sell out in minutes. We run a scheduled
            shuttle service instead — a bus {fastest.headwayMinutes === 15 ? "every 15 minutes" : `every ${fastest.headwayMinutes} minutes`}, {totalDailyDepartures()} departures a day,
            free guaranteed parking, and you pick your own return time.
          </p>
        </div>

        <SearchWidget className="mt-9" />

        {/* Proof strip. Numbers a visitor can verify against the timetable on
            this same site — nothing here is unfalsifiable marketing. */}
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-white sm:grid-cols-4">
          {[
            { v: String(totalDailyDepartures()), l: "departures every day" },
            { v: `${routes.length}`, l: "routes across the Bow Valley" },
            { v: "15 min", l: "shortest wait between buses" },
            { v: site.proof.onTimeRate, l: "departed on time last season" },
          ].map((stat) => (
            <div key={stat.l}>
              <dt className="sr-only">{stat.l}</dt>
              <dd>
                <span className="text-on-photo block font-display text-[1.75rem] font-bold leading-none tabular">
                  {stat.v}
                </span>
                <span className="text-on-photo mt-1.5 block text-[0.8125rem] leading-snug text-white/75">
                  {stat.l}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
