import { describe, expect, test } from 'bun:test';
import {
  parseTwitterStatusId,
  renderTwitterEmbedHtml,
  transformTwitterCodeBlock,
} from './twitter-embed.mjs';

describe('parseTwitterStatusId', () => {
  test('extracts a status id from a fenced code block body', () => {
    expect(parseTwitterStatusId('\n1602945340369698816\n')).toBe('1602945340369698816');
  });

  test('extracts a status id from a tweet URL', () => {
    expect(
      parseTwitterStatusId('https://x.com/asazutaiga/status/1602945340369698816?s=20'),
    ).toBe('1602945340369698816');
  });
});

describe('renderTwitterEmbedHtml', () => {
  test('renders a Twitter blockquote embed for the status id', () => {
    expect(renderTwitterEmbedHtml('1602945340369698816')).toBe(
      '<blockquote class="twitter-tweet"><a href="https://twitter.com/i/web/status/1602945340369698816">https://twitter.com/i/web/status/1602945340369698816</a></blockquote>',
    );
  });
});

describe('transformTwitterCodeBlock', () => {
  test('replaces a twitter code block with raw html', () => {
    expect(
      transformTwitterCodeBlock({
        type: 'code',
        lang: 'twitter',
        value: '1602945340369698816',
      }),
    ).toEqual({
      type: 'html',
      value:
        '<blockquote class="twitter-tweet"><a href="https://twitter.com/i/web/status/1602945340369698816">https://twitter.com/i/web/status/1602945340369698816</a></blockquote>',
    });
  });

  test('leaves non-twitter code blocks unchanged', () => {
    expect(
      transformTwitterCodeBlock({
        type: 'code',
        lang: 'txt',
        value: 'from:@asazutaiga since:2022-01-01 until:2022-02-01',
      }),
    ).toBeNull();
  });
});
