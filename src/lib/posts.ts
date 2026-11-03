import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';

export type BlogPost = {
  slug: string;
  title: string;
  createdAt: string;
  archived: boolean;
  body: string;
};

export type YearPosts = {
  year: string;
  posts: BlogPost[];
};

export type ContentPostEntryLike = {
  id: string;
  body?: string;
  data: {
    title: string;
    createdAt: string;
    archived: boolean;
  };
};

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
const JST_TIME_ZONE = 'Asia/Tokyo';

const getPart = (
  parts: Intl.DateTimeFormatPart[],
  type: 'year' | 'month' | 'day',
): string => {
  const part = parts.find((item) => item.type === type)?.value;
  if (!part) {
    throw new Error(`Failed to extract ${type} from Intl.DateTimeFormatParts.`);
  }
  return part;
};

export const ensureDateFormat = (ymd: string): string => {
  if (!DATE_FORMAT.test(ymd)) {
    throw new Error(
      `Invalid createdAt format: "${ymd}". Use YYYY-MM-DD (example: 2026-04-05).`,
    );
  }
  return ymd;
};

export const toJstYmd = (date: Date): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: JST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = getPart(parts, 'year');
  const month = getPart(parts, 'month');
  const day = getPart(parts, 'day');
  return `${year}-${month}-${day}`;
};

export const shiftYmd = (ymd: string, days: number): string => {
  ensureDateFormat(ymd);
  const [year, month, day] = ymd.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day));
  shifted.setUTCDate(shifted.getUTCDate() + days);
  const shiftedYear = shifted.getUTCFullYear();
  const shiftedMonth = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const shiftedDay = String(shifted.getUTCDate()).padStart(2, '0');
  return `${shiftedYear}-${shiftedMonth}-${shiftedDay}`;
};

export const sortPostsByCreatedAtDesc = (posts: BlogPost[]): BlogPost[] => {
  return [...posts].sort((a, b) => {
    ensureDateFormat(a.createdAt);
    ensureDateFormat(b.createdAt);
    return b.createdAt.localeCompare(a.createdAt);
  });
};

export const pickLatestPosts = (
  posts: BlogPost[],
  now: Date = new Date(),
  days: number = 365,
  limit: number = 20,
): BlogPost[] => {
  const cutoffDate = shiftYmd(toJstYmd(now), -days);
  return sortPostsByCreatedAtDesc(posts)
    .filter((post) => ensureDateFormat(post.createdAt) >= cutoffDate)
    .slice(0, limit);
};

export const groupPostsByYear = (posts: BlogPost[]): YearPosts[] => {
  const grouped = new Map<string, BlogPost[]>();

  for (const post of sortPostsByCreatedAtDesc(posts)) {
    const createdAt = ensureDateFormat(post.createdAt);
    const year = createdAt.slice(0, 4);
    const bucket = grouped.get(year) ?? [];
    bucket.push(post);
    grouped.set(year, bucket);
  }

  return [...grouped.entries()].map(([year, yearPosts]) => ({
    year,
    posts: yearPosts,
  }));
};

const excerptParser = unified().use(remarkParse).use(remarkMdx);
type ExcerptNode = {
  type: string;
  position?: { start: { offset?: number }; end: { offset?: number } };
  children?: ExcerptNode[];
};

const stripMdxSyntax = (markdown: string): string => {
  let tree: ExcerptNode;
  try { tree = excerptParser.parse(markdown); }
  catch { return markdown; } // Older Markdown may contain syntax that is not valid MDX.
  const ranges: [number, number][] = [];
  const visit = (node: ExcerptNode) => {
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start === undefined || end === undefined) return;
    if (['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression'].includes(node.type)) {
      ranges.push([start, end]);
      return;
    }
    if (['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type)) {
      const children = node.children ?? [];
      if (!children.length) { ranges.push([start, end]); return; }
      ranges.push([start, children[0].position!.start.offset!]);
      ranges.push([children[children.length - 1].position!.end.offset!, end]);
    }
    node.children?.forEach(visit);
  };
  visit(tree);
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) {
    markdown = markdown.slice(0, start) + ' ' + markdown.slice(end);
  }
  return markdown;
};

const stripMarkdown = (markdown: string): string => {
  return stripMdxSyntax(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^\)]*\)/g, ' ')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getExcerpt = (markdown: string, maxChars: number = 110): string => {
  const plain = stripMarkdown(markdown);
  if (plain.length <= maxChars) {
    return plain;
  }
  return `${plain.slice(0, maxChars).trimEnd()}…`;
};

export const getDisplayTitle = (title: string, archived: boolean): string => {
  return archived ? `${title} (Archived)` : title;
};

export const fromContentEntry = (entry: ContentPostEntryLike): BlogPost => {
  return {
    slug: entry.id,
    title: entry.data.title,
    createdAt: ensureDateFormat(entry.data.createdAt),
    archived: entry.data.archived,
    body: entry.body ?? '',
  };
};
