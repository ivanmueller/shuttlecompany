/**
 * Renders a JSON-LD block.
 *
 * `JSON.stringify` output is escaped for the one sequence that can break out
 * of a script element. React does not escape children of a
 * dangerouslySetInnerHTML script, so this has to be explicit.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
