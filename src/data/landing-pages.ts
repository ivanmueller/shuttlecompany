/**
 * Keyword landing pages.
 *
 * The SEO thesis in one file. The queries this business needs to own —
 * "moraine lake shuttle", "parks canada shuttle", "roam transit lake louise",
 * "how to get to moraine lake" — are informational before they are
 * transactional. Somebody searching "parks canada shuttle" is not looking for
 * us; they are looking for Parks Canada, will find it sold out, and then need
 * somewhere to go next. These pages are that somewhere.
 *
 * Each page is content-first and genuinely answers the query, including where
 * the honest answer is "book the competitor". Thin pages that bait a keyword
 * and pivot straight to a booking button are exactly what Google's helpful
 * content systems demote, and they convert badly besides — a visitor who feels
 * tricked bounces.
 *
 * Adding a page is a data edit. The template, metadata, JSON-LD, breadcrumbs
 * and sitemap entry all follow automatically.
 */

export type Block =
  | { type: "prose"; heading?: string; paragraphs: string[] }
  | {
      type: "list";
      heading?: string;
      intro?: string;
      ordered?: boolean;
      items: { title: string; body: string }[];
    }
  | {
      type: "table";
      heading?: string;
      intro?: string;
      columns: string[];
      rows: string[][];
      note?: string;
    }
  | { type: "routes"; heading?: string; intro?: string; slugs: string[] }
  | { type: "timetable"; heading?: string; routeSlug: string; limit?: number }
  | {
      type: "callout";
      tone: "info" | "ontime" | "delay" | "issue";
      heading: string;
      body: string;
    }
  | { type: "faq"; heading?: string; questions: string[] }
  | { type: "comparison"; heading?: string };

export interface LandingPage {
  slug: string;
  /** <title>. Front-load the keyword; keep under ~60 characters where possible. */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  lede: string;
  /** Last substantive content review. Surfaced on the page and in Article JSON-LD;
   *  freshness is a real ranking input for seasonal travel queries. */
  updated: string;
  blocks: Block[];
  /** Cross-links rendered at the foot of the page. */
  related: { href: string; label: string }[];
}

export const landingPages: LandingPage[] = [
  /* ---------------------------------------------------------------------- */
  {
    slug: "moraine-lake-shuttle",
    metaTitle: "Moraine Lake Shuttle 2026 — Every 20 Minutes, No Reservation",
    metaDescription:
      "The complete guide to the Moraine Lake shuttle in 2026: every operator, real prices, why Moraine Lake Road is closed to cars, and how to get a seat when Parks Canada is sold out.",
    h1: "The Moraine Lake shuttle, explained",
    eyebrow: "Moraine Lake",
    lede: "Moraine Lake Road has been closed to personal vehicles since 2023. A shuttle is not one option among several — it is very nearly the only way in. Here is every operator, what each actually costs, and what to do when the one you wanted is sold out.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "callout",
        tone: "issue",
        heading: "You cannot drive to Moraine Lake",
        body: "Parks Canada closed Moraine Lake Road to all personal vehicles year-round starting in 2023. There is no parking at the lake, no drop-off, and no exception for arriving early. The only ways in are a commercial shuttle, the Parks Canada shuttle, a licensed tour, a bicycle, or on foot.",
      },
      {
        type: "prose",
        heading: "Why the road closed, and what it means for your trip",
        paragraphs: [
          "Before the closure, the 24-space lot at Moraine Lake was full by 4:00 am on summer days, and the road became a queue of vehicles turning around. Parks Canada's response was to remove private cars from the corridor entirely and move everyone onto buses.",
          "The practical consequence is that access to one of the most photographed lakes in the world is now capacity-limited, and that capacity is allocated by whoever books first. In practice, demand exceeds supply for most of July and August.",
          "That is the entire reason a service like ours exists. We are not trying to be cheaper than the Parks Canada shuttle — nobody can be. We run more buses so there is somewhere to go when it is full.",
        ],
      },
      {
        type: "table",
        heading: "Every way to reach Moraine Lake in 2026",
        intro: "Prices are per adult, round trip, and exclude the Parks Canada park pass that every visitor needs regardless.",
        columns: ["How", "Cost", "Availability", "Worth knowing"],
        rows: [
          [
            "Parks Canada shuttle",
            "$8",
            "Reservation-only, released in seasonal windows",
            "Cheapest by a wide margin. Sells out within minutes of each release.",
          ],
          [
            "Larch Line Route 1",
            "$29",
            "Every 20 minutes, seats released daily",
            "Open return, free reserved parking, same-day seats.",
          ],
          [
            "Moraine Lake Bus Company",
            "$70",
            "Book in advance online",
            "Well-established operator with comparable frequency.",
          ],
          [
            "Roam Transit",
            "—",
            "Does not serve Moraine Lake",
            "Roam runs the Banff–Lake Louise corridor, not the Moraine Lake road.",
          ],
          [
            "Guided tour",
            "$100–250",
            "Generally available",
            "Includes a guide and usually other stops. A different product.",
          ],
          [
            "Bicycle",
            "Free",
            "Always",
            "14 km each way with 400 m of climbing. Genuinely popular with fit cyclists.",
          ],
          [
            "Taxi or rideshare",
            "—",
            "Not permitted",
            "Private hire vehicles are not allowed on the closed road.",
          ],
        ],
        note: "Verified 2026-08-01 from each operator's public website. Re-checked every season.",
      },
      {
        type: "prose",
        heading: "How long to spend at the lake",
        paragraphs: [
          "Ninety minutes covers the Rockpile viewpoint, the lakeshore trail as far as the far end, and photographs without rushing. That is what most visitors want and it is what most visitors book.",
          "Allow four to five hours if you are walking up to Larch Valley or continuing to Sentinel Pass — the classic hike from the lake, and spectacular in the last week of September when the larches turn. Canoe rentals add about an hour including the queue.",
          "This is the argument for an open return rather than a fixed slot. Deciding at the lake that you want another hour is normal; discovering that your assigned return bus leaves in fifteen minutes is how a good day ends badly.",
        ],
      },
      { type: "timetable", heading: "Today's departures to Moraine Lake", routeSlug: "moraine-lake-express", limit: 12 },
      {
        type: "faq",
        heading: "Moraine Lake questions",
        questions: [
          "Can I drive my own car to Moraine Lake?",
          "How long does the shuttle to Moraine Lake take?",
          "Is there cell service at Moraine Lake?",
          "What time is sunrise at Moraine Lake?",
          "Can I visit both Moraine Lake and Lake Louise in one day?",
        ],
      },
      { type: "routes", heading: "Routes serving Moraine Lake", slugs: ["moraine-lake-express", "moraine-lake-sunrise"] },
    ],
    related: [
      { href: "/moraine-lake-sunrise", label: "Moraine Lake sunrise guide" },
      { href: "/parks-canada-shuttle-alternative", label: "When Parks Canada is sold out" },
      { href: "/how-to-get-to-moraine-lake", label: "Every way to reach the lake" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "parks-canada-shuttle-alternative",
    metaTitle: "Parks Canada Shuttle Sold Out? Your Options for 2026",
    metaDescription:
      "The Parks Canada shuttle to Moraine Lake and Lake Louise releases seats in scheduled windows that sell out in minutes. Here is how the release works, how to still get a seat, and what to do when you cannot.",
    h1: "The Parks Canada shuttle is sold out. Now what?",
    eyebrow: "Parks Canada shuttle",
    lede: "It is the cheapest way to reach the lakes, and for most of the summer it is genuinely impossible to book. This page explains how the reservation system actually works, how to give yourself the best shot at it, and what your options are once it is gone.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "callout",
        tone: "info",
        heading: "Try Parks Canada first",
        body: "At $8 round trip, the Parks Canada shuttle is a genuinely excellent deal and cheaper than anything we or anyone else can offer. If you can get a seat, take it. This page is for the far larger number of visitors who cannot.",
      },
      {
        type: "list",
        heading: "How the reservation system works",
        intro: "Understanding the mechanics is most of the battle. The seats are not gone because you were unlucky — they are gone because of how the release is structured.",
        ordered: true,
        items: [
          {
            title: "Seats are released in scheduled windows, not continuously",
            body: "Parks Canada opens reservations for blocks of the season on set dates, typically at 8:00 am Mountain Time. Everything in that block goes on sale at once, and a large share of it is claimed in the first few minutes.",
          },
          {
            title: "A smaller daily release opens 48 hours ahead",
            body: "A limited number of seats is held back and released two days before travel. This is the single most useful thing to know, and it is where most successful last-minute bookings come from. Set an alarm for 8:00 am Mountain, two days before you want to travel.",
          },
          {
            title: "The queue is genuine",
            body: "At release time you will be placed in a virtual waiting room. Refreshing does not help and can send you to the back. One tab, one device, wait it out.",
          },
          {
            title: "Cancellations trickle back in",
            body: "Seats do reappear as people cancel, unpredictably and usually in ones and twos. Checking the day before is not a waste of time, but it is not a plan either.",
          },
        ],
      },
      {
        type: "prose",
        heading: "What Parks Canada gives you, and what it does not",
        paragraphs: [
          "For $8 you get a return trip from the Lake Louise Park & Ride with a reserved outbound and return time. Parking at the Park & Ride is free, subject to space, and there is a connector service between the two lakes for people who have booked both.",
          "The constraint that catches people out is the fixed return. Your slot is assigned when you book, so a slow hike, a long lunch or a canoe queue can turn into a genuine problem. There is no facility for boarding an earlier or later bus on a whim.",
          "The other constraint is timing. The Parks Canada service does not run before dawn, so if you came for the Ten Peaks at first light — which is the reason a great many people come at all — it is not an option at any price.",
        ],
      },
      { type: "comparison", heading: "Side by side" },
      {
        type: "list",
        heading: "If you have already missed it, in order of what to try",
        ordered: true,
        items: [
          {
            title: "Check the 48-hour release",
            body: "Two days before travel, 8:00 am Mountain Time. Free, and it works often enough to be worth the alarm.",
          },
          {
            title: "Book a scheduled shuttle instead",
            body: "We run Route 1 to Moraine Lake every 20 minutes with seats released daily, including same-day. It costs more than $8 and less than every other commercial operator, and the return is open.",
          },
          {
            title: "Shift your timing rather than your plan",
            body: "Afternoon and early-evening departures have real availability all summer, on every operator. The light at 6:00 pm is better than at 11:00 am and the lakeshore is quieter.",
          },
          {
            title: "Cycle it",
            body: "14 km and 400 m of climbing each way from the village. Free, legal, and on a clear morning it is a better experience than any bus.",
          },
        ],
      },
      {
        type: "faq",
        heading: "Common questions",
        questions: [
          "Do I need a reservation, or can I just show up?",
          "How is this different from the Parks Canada shuttle?",
          "Do I need a Parks Canada park pass?",
          "Do I get to choose my return time?",
        ],
      },
      { type: "routes", heading: "Our routes to the lakes", slugs: ["moraine-lake-express", "lake-louise-lakeshore-shuttle", "moraine-lake-sunrise"] },
    ],
    related: [
      { href: "/moraine-lake-shuttle", label: "The Moraine Lake shuttle explained" },
      { href: "/roam-transit-alternative", label: "Roam Transit sold out?" },
      { href: "/no-reservation", label: "Travelling without a reservation" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "roam-transit-alternative",
    metaTitle: "Roam Transit Sold Out to Lake Louise? Here's Your Alternative",
    metaDescription:
      "Roam Transit's 8X Banff–Lake Louise express is reservation-only and sold out for much of the summer. Here is how Roam works, what it does not cover, and how to get to Lake Louise and Moraine Lake when it is full.",
    h1: "When Roam Transit is full",
    eyebrow: "Roam Transit",
    lede: "Roam is the Bow Valley's regional transit system and it is genuinely good — frequent, cheap and well run. Its Lake Louise express is also reservation-only and sold out for much of the summer, and it does not go to Moraine Lake at all.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "callout",
        tone: "info",
        heading: "Roam is not the enemy",
        body: "Roam Transit is public transit run by the Bow Valley Regional Transit Services Commission, and at its fare it is the best value on the corridor. Where our services overlap, we are adding capacity that the corridor plainly needs — not arguing that you should not take Roam.",
      },
      {
        type: "prose",
        heading: "What Roam covers",
        paragraphs: [
          "Roam runs local routes around Banff and Canmore, regional routes connecting the two, and seasonal services to places like Lake Minnewanka and Johnston Canyon. For getting around the townsites it is the obvious answer and nothing here competes with it.",
          "The route visitors search for is the 8X, the Banff–Lake Louise express. It requires a reservation in summer, and those reservations open in stages through the spring and are typically gone for peak dates well before the season starts.",
          "Roam does not serve Moraine Lake. No public transit does. Once you are at Lake Louise you still need a separate shuttle for the last 14 km, which is the leg that our Route 1 exists to run.",
        ],
      },
      {
        type: "table",
        heading: "Banff to Lake Louise: the options",
        columns: ["Operator", "Fare", "Frequency", "Reservation"],
        rows: [
          ["Roam Transit 8X", "$12.50 one way", "Several times daily in season", "Required, often sold out"],
          ["Larch Line Route 4", "$19 one way", "Every 30 minutes, 5:30 am – 9:00 pm", "Book any time, including same day"],
          ["Driving", "Fuel + parking", "Any time", "Lake Louise lots fill before 07:00"],
          ["Guided tour", "$100+", "Fixed departures", "Book ahead"],
        ],
        note: "Roam fare verified 2026-08-01. Larch Line is not affiliated with Roam Transit or the Bow Valley Regional Transit Services Commission.",
      },
      {
        type: "prose",
        heading: "How the two services fit together",
        paragraphs: [
          "The most common sensible plan is to use whichever corridor service you can actually book, then take Route 1 from Lake Louise Village onward to Moraine Lake. Our Moraine Lake service does not care how you arrived in the village.",
          "If you have a Roam reservation, keep it — it is cheaper than ours and it drops you at the same hub. Book the Moraine Lake leg separately and you have a complete day for well under what a tour costs.",
          "If you do not, Route 4 runs every 30 minutes from the Banff High School transit hub and connects with a 10-minute buffer to Route 1.",
        ],
      },
      { type: "timetable", heading: "Today's Banff departures", routeSlug: "banff-lake-louise-connector", limit: 10 },
      { type: "routes", heading: "Routes on the Banff corridor", slugs: ["banff-lake-louise-connector", "canmore-lake-louise-direct", "moraine-lake-express"] },
    ],
    related: [
      { href: "/banff-to-lake-louise-bus", label: "Banff to Lake Louise by bus" },
      { href: "/parks-canada-shuttle-alternative", label: "Parks Canada shuttle sold out?" },
      { href: "/canmore-to-lake-louise", label: "Canmore to Lake Louise" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "lake-louise-shuttle",
    metaTitle: "Lake Louise Shuttle — Every 15 Minutes, Skip the Parking",
    metaDescription:
      "The Lake Louise lakeshore parking lot fills before 7:00 am most summer days. Our shuttle runs every 15 minutes from the village and Park & Ride, from $12 round trip with free parking included.",
    h1: "Getting to Lake Louise lakeshore",
    eyebrow: "Lake Louise",
    lede: "You can drive to the lakeshore. The problem is that several thousand other people have the same idea, and the lot is full before most of them have had breakfast.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "callout",
        tone: "delay",
        heading: "The lakeshore lot fills before 07:00",
        body: "From late June through early September the Parks Canada lot at the lakeshore is routinely full by 7:00 am and stays full until late afternoon. It is also paid parking. Traffic control turns vehicles away at the bottom of the hill, which means a wasted hour and a bad start.",
      },
      {
        type: "prose",
        heading: "Why a shuttle is the sane option here",
        paragraphs: [
          "Unlike Moraine Lake, driving to Lake Louise is legal. It is just a bad idea for most of the summer. The realistic choices are to arrive before 6:30 am, arrive after 5:00 pm, or take a bus.",
          "At $12 round trip our lakeshore service costs less than a day of paid parking at the lake, before counting the fuel and the hour you would spend circling. Free reserved parking at the Gondola Park & Ride is included.",
          "The 15-minute headway is the point. Waiting for a bus is only tolerable when the wait is short, and at 15 minutes it stops feeling like a schedule and starts feeling like a lift.",
        ],
      },
      {
        type: "list",
        heading: "What to do at the lake",
        items: [
          { title: "The lakeshore trail", body: "Flat, 2 km each way to the far end of the lake, and the view back toward the Chateau is the one everyone comes for. Forty-five minutes at a stroll." },
          { title: "Lake Agnes Tea House", body: "3.5 km and 400 m of climbing to a genuine tea house at a hanging lake. Allow three to four hours return. Cash only, and it is worth it." },
          { title: "Canoe rental", body: "Available at the boathouse, expensive, and the photograph is unarguable. Queues are shortest before 9:00 am and after 5:00 pm." },
          { title: "Plain of Six Glaciers", body: "The serious option — 11 km return with a second tea house near the top. Half a day, and book a late return." },
        ],
      },
      { type: "timetable", heading: "Today's lakeshore departures", routeSlug: "lake-louise-lakeshore-shuttle", limit: 12 },
      {
        type: "faq",
        heading: "Lake Louise questions",
        questions: [
          "Can I park at Lake Louise Lakeshore and catch the bus from there?",
          "Can I visit both Moraine Lake and Lake Louise in one day?",
          "Where do I park, and is it really free?",
        ],
      },
      { type: "routes", heading: "Routes serving Lake Louise", slugs: ["lake-louise-lakeshore-shuttle", "banff-lake-louise-connector"] },
    ],
    related: [
      { href: "/moraine-lake-shuttle", label: "The Moraine Lake shuttle" },
      { href: "/banff-to-lake-louise-bus", label: "Banff to Lake Louise by bus" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "how-to-get-to-moraine-lake",
    metaTitle: "How to Get to Moraine Lake in 2026 — Every Option Compared",
    metaDescription:
      "Moraine Lake Road is closed to private vehicles. Here is every legal way to reach the lake in 2026, what each costs, how far ahead to book, and which ones actually have availability.",
    h1: "How to get to Moraine Lake in 2026",
    eyebrow: "Planning",
    lede: "Short version: you cannot drive, the cheap shuttle is sold out, and there are more options than most people realise. Long version below.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "list",
        heading: "Every way in, ranked by what most visitors should actually do",
        ordered: true,
        items: [
          {
            title: "Parks Canada shuttle — $8, if you can get it",
            body: "Try the 48-hour release at 8:00 am Mountain, two days before you travel. Cheapest option by a wide margin and worth one alarm.",
          },
          {
            title: "A scheduled commercial shuttle — $29 to $70",
            body: "Several operators run the corridor. Ours goes every 20 minutes at $29 round trip with an open return; Moraine Lake Bus Company is the established alternative. Seats are available same-day for most departures outside peak morning.",
          },
          {
            title: "Cycle from Lake Louise village — free",
            body: "14 km and about 400 m of climbing each way on a paved road closed to most traffic. Two hours up for an average rider, forty minutes back down. Genuinely one of the best rides in the Rockies.",
          },
          {
            title: "A guided tour — $100 to $250",
            body: "Worth it if you want interpretation and other stops in the same day. Not worth it if you only want a lift to the lake.",
          },
          {
            title: "Walk in — free, and long",
            body: "The road is walkable and legal. It is a full day for most people and there are no services at either end of the effort.",
          },
        ],
      },
      {
        type: "callout",
        tone: "issue",
        heading: "Things that do not work",
        body: "Driving your own car, being dropped off by taxi or rideshare, parking at the lake overnight, or arriving before dawn to beat the closure. The road is gated and staffed. There is no early-bird workaround.",
      },
      {
        type: "prose",
        heading: "When to go",
        paragraphs: [
          "The lake is at its most photographed between mid-June and mid-September, when the ice is fully out and the water is the colour that put it on the back of the twenty-dollar note. The road typically opens in late May and closes for the season in mid-October.",
          "The last ten days of September are the local's choice: the larches in Larch Valley turn gold, the crowds thin slightly, and the light is better. It is also the busiest weekend of the autumn, so book earlier than you think.",
          "For time of day, sunrise is the reason most photographers come and the reason our Route 2 exists. Mid-morning is the most crowded and the hardest to book. After 4:00 pm the buses empty out and the lake is markedly quieter.",
        ],
      },
      { type: "comparison", heading: "Operators compared" },
      { type: "routes", heading: "Book a seat", slugs: ["moraine-lake-express", "moraine-lake-sunrise"] },
    ],
    related: [
      { href: "/moraine-lake-shuttle", label: "The Moraine Lake shuttle explained" },
      { href: "/moraine-lake-sunrise", label: "Sunrise at Moraine Lake" },
      { href: "/parks-canada-shuttle-alternative", label: "Parks Canada sold out?" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "moraine-lake-sunrise",
    metaTitle: "Moraine Lake Sunrise 2026 — Times, Shuttles & What to Expect",
    metaDescription:
      "Sunrise at Moraine Lake, month by month: what time first light hits the Ten Peaks, when to leave Lake Louise village, and how to get there before dawn when no public shuttle runs.",
    h1: "Sunrise at Moraine Lake",
    eyebrow: "Sunrise",
    lede: "First light on the Ten Peaks is the shot that put this lake on the map. It happens roughly twenty minutes before the sun clears the ridge, it is over in ten, and no public shuttle will get you there in time.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "table",
        heading: "When to leave, month by month",
        intro: "Aim to be on the Rockpile 45 to 60 minutes before sunrise — alpenglow on the peaks starts well before the sun is up, and the Rockpile is a 10-minute walk from the bus loop.",
        columns: ["Month", "Approx. sunrise", "Suggested departure", "Notes"],
        rows: [
          ["Late May", "5:35 am", "4:15 am", "Ice may still be on the lake; the water turns turquoise later."],
          ["June", "5:25 am", "4:00 am", "Earliest sunrise of the year. Coldest pre-dawn shuttle of the season."],
          ["July", "5:40 am", "4:15 am", "Peak demand. Book a week ahead."],
          ["August", "6:15 am", "4:50 am", "Warmer mornings, more reliable skies."],
          ["September", "6:55 am", "5:35 am", "Larches turn in the last ten days. The best month, and the busiest weekends."],
          ["Early October", "7:35 am", "6:15 am", "A civilised hour at last. Expect below-freezing on the Rockpile."],
        ],
        note: "Times are approximate and shift through each month. Our Route 2 departures are adjusted weekly against actual sunrise for the date you travel.",
      },
      {
        type: "list",
        heading: "What to actually bring",
        items: [
          { title: "More warmth than you expect", body: "It is routinely 10°C colder at the lake than in the village, and colder again before dawn. Standing still on the Rockpile for an hour in June has caught out a great many people in shorts." },
          { title: "A headtorch", body: "The Rockpile trail is short but it is unlit, uneven and busy with other people in the dark. A phone torch works and annoys everyone around you." },
          { title: "A screenshot of your ticket", body: "There is no cell service at the lake and none for the first few kilometres of the road. A ticket that lives in your inbox is a ticket you do not have." },
          { title: "A tripod, if you are serious", body: "The good light is well below hand-holdable. The Rockpile gets crowded — arrive early enough to choose a spot rather than inherit one." },
        ],
      },
      {
        type: "callout",
        tone: "info",
        heading: "The Parks Canada shuttle does not run before dawn",
        body: "There is no public pre-dawn service to Moraine Lake at any price. Sunrise access is commercial shuttles, a bicycle, or your own legs. Our Route 2 runs from 3:45 am with departures every 25 minutes.",
      },
      { type: "timetable", heading: "Sunrise departures today", routeSlug: "moraine-lake-sunrise" },
      { type: "routes", heading: "Book sunrise", slugs: ["moraine-lake-sunrise", "moraine-lake-express"] },
    ],
    related: [
      { href: "/moraine-lake-shuttle", label: "The Moraine Lake shuttle" },
      { href: "/how-to-get-to-moraine-lake", label: "Every way to reach the lake" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "banff-to-lake-louise-bus",
    metaTitle: "Banff to Lake Louise Bus — Every 30 Minutes, From $19",
    metaDescription:
      "How to get from Banff to Lake Louise by bus in 2026: every operator, fares, journey times, and how to connect through to Moraine Lake on the same day.",
    h1: "Banff to Lake Louise by bus",
    eyebrow: "Banff corridor",
    lede: "It is 57 km up the Trans-Canada, about an hour, and there is no reason to drive it if you are only going for the day — the parking at the other end is the entire problem.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "table",
        heading: "Operators on the corridor",
        columns: ["Operator", "One-way fare", "Frequency", "Journey time"],
        rows: [
          ["Roam Transit 8X", "$12.50", "Several daily, reservation required", "About 60 min"],
          ["Larch Line Route 4", "$19", "Every 30 minutes, 5:30 am – 9:00 pm", "65 min"],
          ["Larch Line Route 5 (from Canmore)", "$29", "Hourly", "95 min from Canmore"],
          ["Intercity coach", "$25–40", "A few daily", "60–75 min"],
        ],
        note: "Fares verified 2026-08-01. Not affiliated with Roam Transit or any other operator listed.",
      },
      {
        type: "prose",
        heading: "Connecting through to Moraine Lake",
        paragraphs: [
          "Everything on this corridor terminates at Lake Louise Village, and the village is where the Moraine Lake services start. That means a day trip from Banff is two tickets, not one, and neither operator will sell you the other.",
          "Allow a 20-minute buffer between arriving in the village and your Moraine Lake departure. Our own connections are timed with a 10-minute buffer and the Moraine Lake buses run every 20 minutes anyway, so a missed connection costs very little.",
          "A realistic Banff day: leave at 7:00 am, be at Moraine Lake by 8:30, back in the village by noon, lakeshore in the afternoon, home by 6:00 pm. Roughly $60 per adult all in, plus the park pass.",
        ],
      },
      { type: "timetable", heading: "Today's departures from Banff", routeSlug: "banff-lake-louise-connector", limit: 12 },
      { type: "routes", heading: "Corridor routes", slugs: ["banff-lake-louise-connector", "canmore-lake-louise-direct"] },
    ],
    related: [
      { href: "/roam-transit-alternative", label: "Roam Transit sold out?" },
      { href: "/canmore-to-lake-louise", label: "Canmore to Lake Louise" },
      { href: "/moraine-lake-shuttle", label: "Onward to Moraine Lake" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "canmore-to-lake-louise",
    metaTitle: "Canmore to Lake Louise Bus — Direct, Hourly, No Transfer",
    metaDescription:
      "A direct hourly bus from Canmore to Lake Louise with no transfer in Banff. Free 12-hour parking at the Canmore end, connections to Moraine Lake at the other.",
    h1: "Canmore to Lake Louise, without the transfer",
    eyebrow: "Canmore",
    lede: "Most public transit options from Canmore ask you to change buses in Banff. Route 5 does not — it runs the whole 95 km, hourly, on reclining coach seating.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "prose",
        heading: "Why this route exists",
        paragraphs: [
          "Canmore has become the practical base for a lot of Bow Valley visitors — cheaper beds, better restaurants, and outside the park gate. What it does not have is a straightforward way to reach Lake Louise on a summer morning.",
          "The existing regional options involve a transfer in Banff onto a corridor service that is itself reservation-only and frequently full. Two connections, either of which can fail, for a trip that takes an hour and a half in a car.",
          "Route 5 is the direct version. One bus, one ticket, hourly from 6:00 am, and free 12-hour parking at the Canmore Civic Centre for anyone who would rather not leave a car at the trailhead end.",
        ],
      },
      {
        type: "callout",
        tone: "delay",
        heading: "Highway construction eastbound",
        body: "Roadworks near Dead Man's Flats are currently adding up to 10 minutes to eastbound afternoon services. Westbound is unaffected. We will update this page when it clears.",
      },
      { type: "timetable", heading: "Today's departures from Canmore", routeSlug: "canmore-lake-louise-direct" },
      { type: "routes", heading: "Onward connections", slugs: ["canmore-lake-louise-direct", "moraine-lake-express", "lake-louise-lakeshore-shuttle"] },
    ],
    related: [
      { href: "/banff-to-lake-louise-bus", label: "Banff to Lake Louise by bus" },
      { href: "/roam-transit-alternative", label: "Roam Transit alternatives" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "no-reservation",
    metaTitle: "No Shuttle Reservation? How to Reach the Lakes Anyway",
    metaDescription:
      "Arrived in Banff without a Moraine Lake or Lake Louise shuttle reservation? Here is exactly what to do today, in order, including the free options.",
    h1: "You're here and you have no reservation",
    eyebrow: "Same day",
    lede: "This happens to thousands of people every summer, usually about an hour after checking into the hotel. It is recoverable. Here is the order to try things in.",
    updated: "2026-08-01",
    blocks: [
      {
        type: "list",
        heading: "Today, in order",
        ordered: true,
        items: [
          {
            title: "Check the Parks Canada 48-hour release",
            body: "If your trip is more than two days out, set an alarm for 8:00 am Mountain, two days before. It is $8 and it works more often than people expect.",
          },
          {
            title: "Check our same-day availability",
            body: "We hold back a share of every departure for same-day sale specifically for this situation. Afternoon departures are almost always open; the 8:00 to 11:00 am window is the hard one.",
          },
          {
            title: "Move your visit later in the day",
            body: "The single most effective change you can make. From 4:00 pm the buses empty out, the light improves, and availability stops being a problem on any operator.",
          },
          {
            title: "Do Lake Louise today, Moraine Lake tomorrow",
            body: "The lakeshore service runs every 15 minutes and effectively never sells out. Book it now, book Moraine Lake for tomorrow morning, and you have both.",
          },
          {
            title: "Rent a bike",
            body: "Free of any booking system, legal on the closed road, and 14 km each way. Several outfitters in the village rent by the half day.",
          },
        ],
      },
      {
        type: "callout",
        tone: "ontime",
        heading: "The one thing not to do",
        body: "Do not drive up Moraine Lake Road hoping to be waved through. The road is gated and staffed, there is no parking at the lake, and the round trip from the village to the gate and back is 40 minutes you cannot spare.",
      },
      { type: "timetable", heading: "What's still available today", routeSlug: "moraine-lake-express", limit: 14 },
      { type: "routes", heading: "Book a seat now", slugs: ["moraine-lake-express", "lake-louise-lakeshore-shuttle", "moraine-lake-sunrise"] },
    ],
    related: [
      { href: "/parks-canada-shuttle-alternative", label: "How the Parks Canada release works" },
      { href: "/how-to-get-to-moraine-lake", label: "Every way to reach the lake" },
    ],
  },
];

export const landingPageBySlug = (slug: string) =>
  landingPages.find((p) => p.slug === slug);
