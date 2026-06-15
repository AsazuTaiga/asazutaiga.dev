# Markdown Line Breaks and List Indentation Design

## Goal

Make authored Markdown match the expected blog presentation in two ways:

- A single newline in a paragraph renders as an HTML line break.
- Unordered and ordered lists inside an article have visible indentation.

## Approach

Add `remark-breaks` to Astro's existing Markdown remark plugin pipeline. Keep
`remark-gfm` and the Twitter embed plugin unchanged, and apply the line-break
plugin to both Markdown and MDX content through the shared Astro Markdown
configuration.

Add scoped CSS for `.article ul` and `.article ol` using logical inline-start
padding. The rule applies only to rendered article content and preserves the
existing reset used by navigation and post-list components.

## Alternatives Considered

1. Require two trailing spaces or blank lines in every post. This follows
   standard Markdown but does not match the desired authoring behavior.
2. Insert `<br>` elements manually. This is repetitive and makes content less
   readable.
3. Use `remark-breaks` globally for article Markdown. This is the selected
   approach because it is small, established, and consistent for all posts.

## Dependencies and Configuration

Add `remark-breaks` as a direct dependency and register it after `remark-gfm`
in `astro.config.mjs`. Existing GFM parsing remains enabled.

## Testing

Add a focused test that processes Markdown with the configured remark plugins
and confirms that a single source newline produces a `<br>` element. Add a
focused assertion for the article list indentation rule, then run the full test
suite, Astro checks, and production build.

## Non-goals

- Changing spacing for navigation lists or the notes index.
- Replacing Astro's Markdown renderer.
- Changing other Markdown typography or GFM behavior.
