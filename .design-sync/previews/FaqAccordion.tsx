import { FaqAccordion, faqs, featuredFaqs } from "shuttlecompany";

/**
 * The FAQ list, built on native `<details>` rather than JS state.
 *
 * That choice is load-bearing: the answer text is in the DOM for crawlers
 * whether or not it is open, it works before hydration, and browser
 * find-in-page opens the right item — which is how visitors actually use a
 * 30-question FAQ.
 */
export function Featured() {
  return <FaqAccordion items={featuredFaqs.slice(0, 6)} />;
}

/** Filtered to one topic, which is how the route and landing pages use it. */
export function ByTopic() {
  return <FaqAccordion items={faqs.filter((f) => f.topic === "moraine").slice(0, 5)} />;
}

/** A short list — the form used at the bottom of a landing page. */
export function Short() {
  return <FaqAccordion items={faqs.slice(0, 3)} />;
}
