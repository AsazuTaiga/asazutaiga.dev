import { expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';

test('renders a single Markdown newline as a line break', async () => {
  const processor = await createMarkdownProcessor({
    remarkPlugins: [remarkBreaks],
    syntaxHighlight: false,
  });
  const result = await processor.render('first line\nsecond line');

  expect(result.code).toContain('first line<br>\nsecond line');
});

test('indents unordered and ordered lists inside articles', async () => {
  const css = await readFile(new URL('../styles/global.css', import.meta.url), 'utf8');

  expect(css).toMatch(/\.article\s+:is\(ul, ol\)\s*{[^}]*padding-inline-start:\s*(?!0(?:rem|px)?)[^;}]+;/s);
});

test('renders the sleep post bullet list at three nested levels', async () => {
  const markdown = await readFile(new URL('../content/posts/sleep.md', import.meta.url), 'utf8');
  const processor = await createMarkdownProcessor({ syntaxHighlight: false });
  const result = await processor.render(markdown);

  expect(result.code).toMatch(/<p>まず、朝一[^<]+<\/p>\s*<ul>\s*<li>これが結構気分に悪影響だ/);
  expect(result.code).toMatch(/<li>逆に、外部仕様[^<]+\s*<ul>\s*<li>ただ、そのぐらいの重さになると/);
});
