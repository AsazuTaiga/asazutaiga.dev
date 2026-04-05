import { describe, expect, test } from 'bun:test';
import {
  ensureDateFormat,
  getExcerpt,
  groupPostsByYear,
  pickLatestPosts,
  shiftYmd,
  sortPostsByCreatedAtDesc,
  toJstYmd,
  type BlogPost,
} from './posts';

const makePost = (slug: string, createdAt: string): BlogPost => ({
  slug,
  title: slug,
  createdAt,
  body: `${slug} body`,
});

describe('ensureDateFormat', () => {
  test('accepts YYYY-MM-DD', () => {
    expect(ensureDateFormat('2026-04-05')).toBe('2026-04-05');
  });

  test('rejects slash-separated date', () => {
    expect(() => ensureDateFormat('2026/04/05')).toThrow();
  });
});

describe('date helpers', () => {
  test('converts to JST date string', () => {
    expect(toJstYmd(new Date('2026-04-04T15:10:00.000Z'))).toBe('2026-04-05');
  });

  test('shifts date by days', () => {
    expect(shiftYmd('2026-04-05', -365)).toBe('2025-04-05');
  });
});

describe('post sorting and filtering', () => {
  test('sorts by createdAt descending', () => {
    const sorted = sortPostsByCreatedAtDesc([
      makePost('old', '2025-05-01'),
      makePost('new', '2026-01-01'),
      makePost('mid', '2025-12-31'),
    ]);

    expect(sorted.map((post) => post.slug)).toEqual(['new', 'mid', 'old']);
  });

  test('filters to last 365 days in JST and limits to 20 items', () => {
    const now = new Date('2026-04-05T00:00:00.000Z');

    const recent = Array.from({ length: 25 }, (_, index) => {
      const day = String(index + 1).padStart(2, '0');
      return makePost(`recent-${day}`, `2026-03-${day}`);
    });

    const posts = [
      ...recent,
      makePost('borderline', '2025-04-05'),
      makePost('too-old', '2025-04-04'),
    ];

    const picked = pickLatestPosts(posts, now, 365, 20);

    expect(picked).toHaveLength(20);
    expect(picked.some((post) => post.slug === 'too-old')).toBeFalse();
    expect(picked.some((post) => post.slug === 'borderline')).toBeFalse();
  });
});

describe('groupPostsByYear', () => {
  test('groups sorted posts by year', () => {
    const groups = groupPostsByYear([
      makePost('a', '2026-01-01'),
      makePost('b', '2025-12-31'),
      makePost('c', '2026-04-05'),
    ]);

    expect(groups.map((group) => group.year)).toEqual(['2026', '2025']);
    expect(groups[0].posts.map((post) => post.slug)).toEqual(['c', 'a']);
  });
});

describe('getExcerpt', () => {
  test('strips markdown and truncates', () => {
    const excerpt = getExcerpt('# Heading\n\nこれは **テスト** [link](https://example.com) です。', 11);
    expect(excerpt).toBe('Heading これは…');
  });
});
