/**
 * Renders a schema.org graph as a JSON-LD script tag.
 *
 * The `<` escape is the standard guard against a string in the data ending the
 * script element early; none of the current data is user-supplied, but the
 * Bandsintown venue names on /tour are third-party, so the escape is not
 * optional.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
