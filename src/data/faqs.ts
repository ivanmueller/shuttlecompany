/**
 * FAQ content.
 *
 * These do double duty: they answer the objections that stop a booking, and
 * they are emitted as FAQPage structured data, which is how this site earns
 * real estate on "moraine lake shuttle" and "parks canada shuttle" queries.
 *
 * Answers are plain strings (no markup) because Google's FAQPage parser is
 * strict and because the same text is reused in the AI-answer surfaces that
 * increasingly sit above the blue links.
 */

export interface Faq {
  q: string;
  a: string;
  /** Grouping for the on-page accordion. */
  topic: "booking" | "moraine" | "lake-louise" | "getting-here" | "onboard" | "policies";
  /** Surface this one on the home page — the highest-intent objections only. */
  featured?: boolean;
}

export const faqs: Faq[] = [
  /* ---- Booking ---- */
  {
    q: "Do I need a reservation, or can I just show up?",
    a: "Booking ahead is always safer, but unlike the Parks Canada shuttle we hold a share of every departure for same-day sales. Seats are released continuously through the day rather than in two seasonal windows, so if you missed the Parks Canada reservation release you can usually still travel with us today.",
    topic: "booking",
    featured: true,
  },
  {
    q: "How is this different from the Parks Canada shuttle?",
    a: "The Parks Canada shuttle is reservation-only, and its seats are released in scheduled windows that sell out within minutes of opening. We run a scheduled public transit service instead: departures every 15 to 30 minutes on our core routes, seats released daily, and an open return so you choose when to come back. Parks Canada is cheaper if you can get a seat — we exist for the far larger number of visitors who cannot.",
    topic: "booking",
    featured: true,
  },
  {
    q: "How is this different from Roam Transit?",
    a: "Roam Transit is the Bow Valley's regional public transit system and it is excellent. Its Lake Louise express reservations are also sold out for much of the summer, and Roam does not serve Moraine Lake at all. We add capacity on the Banff–Lake Louise corridor and run the Moraine Lake and lakeshore legs that Roam does not operate.",
    topic: "booking",
    featured: true,
  },
  {
    q: "Can I change or cancel my booking?",
    a: "Yes. Change your date or time free of charge up to 2 hours before departure, using the link in your confirmation email. Cancel more than 24 hours ahead for a full refund; cancel inside 24 hours and you receive a credit valid for the rest of the season.",
    topic: "booking",
    featured: true,
  },
  {
    q: "Are your fares one-way or round trip?",
    a: "Routes 1, 2 and 3 are sold as round trips and include your return. Routes 4 and 5 are sold one-way so you can mix and match with other operators; a return is simply two one-way fares and can be booked in the same transaction.",
    topic: "booking",
  },
  {
    q: "Do I get to choose my return time?",
    a: "On our Moraine Lake and lakeshore routes you book an outbound departure and return on any bus with an open seat. Show your ticket and board. On a busy afternoon you may wait for the following bus, which is at most 20 minutes on Route 1.",
    topic: "booking",
    featured: true,
  },
  {
    q: "How far in advance should I book?",
    a: "For a mid-morning summer departure to Moraine Lake, two to three days ahead is comfortable. Sunrise service in July and August is the tightest and is worth booking a week out. Afternoon and evening departures are usually available on the day.",
    topic: "booking",
  },
  {
    q: "Can I pay on board?",
    a: "No. Every seat is booked online in advance or at a staffed kiosk at the Lake Louise Village Transit Hub and the Gondola Park & Ride. Cashless boarding is what keeps our departures on time.",
    topic: "booking",
  },

  /* ---- Moraine Lake ---- */
  {
    q: "Can I drive my own car to Moraine Lake?",
    a: "No. Parks Canada has closed Moraine Lake Road to all personal vehicles year-round. The only ways in are a commercial shuttle like ours, the Parks Canada shuttle, a licensed tour, a bicycle, or on foot.",
    topic: "moraine",
    featured: true,
  },
  {
    q: "How long does the shuttle to Moraine Lake take?",
    a: "About 35 minutes from the Gondola Park & Ride on Route 1, and about 25 minutes on the early-morning Route 2 service when the road is quiet.",
    topic: "moraine",
  },
  {
    q: "How long should I spend at Moraine Lake?",
    a: "Most visitors are satisfied with 90 minutes to 2 hours: the Rockpile viewpoint, the lakeshore trail and photographs. Allow 4 to 5 hours for Larch Valley or the Sentinel Pass hike, and book a later return accordingly.",
    topic: "moraine",
  },
  {
    q: "What time is sunrise at Moraine Lake?",
    a: "It shifts by more than two hours across our season — roughly 5:30 am in mid-June and 7:45 am in early October. Our Route 2 departure times are adjusted weekly so you arrive 45 to 60 minutes before first light, which is when the Ten Peaks catch colour.",
    topic: "moraine",
  },
  {
    q: "Is there cell service at Moraine Lake?",
    a: "No. There is no cell coverage at Moraine Lake and none for the first few kilometres of the road out. Screenshot your ticket before you board — it will not load at the lake.",
    topic: "moraine",
    featured: true,
  },
  {
    q: "Can I get off at Paradise Valley or the Moraine Lake trailheads?",
    a: "Our buses do not make intermediate stops on Moraine Lake Road. Parks Canada restricts commercial stops on that corridor and the road has no safe pull-outs for a 24-passenger coach.",
    topic: "moraine",
  },

  /* ---- Lake Louise ---- */
  {
    q: "Can I visit both Moraine Lake and Lake Louise in one day?",
    a: "Easily. Book Route 1 to Moraine Lake and Route 3 to the lakeshore; both run from the same hub and your tickets are checked independently, so you set the timing. A common plan is Moraine Lake first thing, back to the village for lunch, then the lakeshore in the afternoon when the parking queue is at its worst.",
    topic: "lake-louise",
    featured: true,
  },
  {
    q: "Can I park at Lake Louise Lakeshore and catch the bus from there?",
    a: "You can board Route 3 at the lakeshore, but we do not recommend planning around it: the Parks Canada lakeshore lot regularly fills before 7:00 am in summer and is paid parking. Park free at the Gondola Park & Ride instead — it is included with your booking.",
    topic: "lake-louise",
  },
  {
    q: "Can I walk to Moraine Lake from Lake Louise?",
    a: "There is no maintained trail between the two lakes suitable for a day visit. Walking or cycling Moraine Lake Road is legal but it is 14 km each way with significant climbing and no services.",
    topic: "lake-louise",
  },

  /* ---- Getting here ---- */
  {
    q: "Where do I park, and is it really free?",
    a: "Yes, and your space is guaranteed. Free reserved parking at the Lake Louise Gondola Park & Ride is included with every Route 1 and Route 3 booking, and at Samson Mall for Route 2 sunrise departures. There are over 600 spaces plus an overflow lot that opens automatically on peak days.",
    topic: "getting-here",
    featured: true,
  },
  {
    q: "Do you pick up in Banff or Canmore?",
    a: "Yes. Route 4 runs Banff to Lake Louise every 30 minutes, and Route 5 runs Canmore to Lake Louise hourly without a transfer. Both connect to our Moraine Lake and lakeshore services at the Lake Louise Village Transit Hub.",
    topic: "getting-here",
    featured: true,
  },
  {
    q: "Do I need a Parks Canada park pass?",
    a: "Yes. Every visitor to Banff National Park needs a valid Parks Canada pass for the duration of their stay, regardless of how they travel. A shuttle ticket is not a park pass. Buy one online in advance or at the park gates — the gate queue can be long on summer mornings.",
    topic: "getting-here",
    featured: true,
  },
  {
    q: "What if I miss my bus?",
    a: "Our buses leave on time. If you miss your departure, come to the kiosk and we will put you on the next bus with an open seat at no charge — usually within 20 minutes on Route 1. Arrive 15 minutes before departure; on peak days the walk from the far end of the park-and-ride takes close to 10.",
    topic: "getting-here",
    featured: true,
  },

  /* ---- Onboard ---- */
  {
    q: "Are your buses wheelchair accessible?",
    a: "Every vehicle in our fleet is wheelchair accessible with a ramp and two securement positions. Select the accessible seating option when you book so we can hold the space, or call us and we will arrange it.",
    topic: "onboard",
  },
  {
    q: "What can I bring on board?",
    a: "Day packs, camera gear, tripods, strollers, climbing equipment, walkers and inflatable paddleboards all travel free. We cannot carry rigid canoes or kayaks. There is no separate luggage fee.",
    topic: "onboard",
  },
  {
    q: "Can I bring my dog?",
    a: "Small pets travel free in a carrier that fits on your lap. Certified service animals are welcome at any size with no carrier required. Our policy is aligned with Parks Canada and Roam Transit so you are not caught out mid-trip.",
    topic: "onboard",
  },
  {
    q: "Do your buses have seatbelts and child seats?",
    a: "All coaches on Routes 4 and 5 have three-point seatbelts. Our Moraine Lake shuttles are transit-class vehicles, which are exempt from child-seat requirements under Alberta law; you are welcome to bring and install your own.",
    topic: "onboard",
  },
  {
    q: "Are infants free?",
    a: "Children under 6 travel free on the lap of a paying adult. Book them as a child fare so we have an accurate passenger count for the manifest — the price is zero.",
    topic: "onboard",
  },
  {
    q: "Is there Wi-Fi?",
    a: "Free Wi-Fi and USB charging are available on Routes 4 and 5. Coverage drops out west of Castle Junction and there is none at Moraine Lake.",
    topic: "onboard",
  },

  /* ---- Policies ---- */
  {
    q: "What happens if a departure is cancelled?",
    a: "If we cancel for weather, wildlife closure or mechanical reasons, you get an automatic full refund plus the option of the next available seat. You will be notified by text before you leave for the stop.",
    topic: "policies",
  },
  {
    q: "How do you handle wildfire smoke or road closures?",
    a: "We follow Parks Canada closures without exception. If Moraine Lake Road closes, all affected departures are refunded in full and we will rebook you onto a lakeshore service at no charge if you want to salvage the day.",
    topic: "policies",
  },
  {
    q: "Do you offer group or charter bookings?",
    a: "Yes, for groups of 12 or more, and full-vehicle charters for weddings and corporate travel. Email us with your dates and headcount and we will confirm within one business day.",
    topic: "policies",
  },
];

export const featuredFaqs = faqs.filter((f) => f.featured);

export const faqTopics: { id: Faq["topic"]; label: string }[] = [
  { id: "booking", label: "Booking & tickets" },
  { id: "moraine", label: "Moraine Lake" },
  { id: "lake-louise", label: "Lake Louise" },
  { id: "getting-here", label: "Parking & getting here" },
  { id: "onboard", label: "On board" },
  { id: "policies", label: "Policies" },
];
