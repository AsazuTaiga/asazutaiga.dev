# OGP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 記事ごとにタイトル中心の OGP 画像を自動生成し、記事詳細ページの meta に個別画像を差し込む。

**Architecture:** `astro-og-canvas` で `/og/[slug].png` をビルド時生成し、`BaseLayout.astro` が OGP/Twitter meta を出力する。記事詳細ページだけ `og:type=article` と個別 `og:image` を渡し、一覧ページやホームは既存のままに留める。

**Tech Stack:** Astro 5, Bun, astro:content, astro-og-canvas, TypeScript

---

## File Structure

- `package.json`
  - `astro-og-canvas` を追加する。
- `src/layouts/BaseLayout.astro`
  - OGP/Twitter meta 用 props と `<meta>` 出力をまとめる。
- `src/pages/notes/[slug].astro`
  - 個別 OGP 画像 URL と `og:type=article` を渡す。
- `src/pages/og/[slug].png.ts`
  - 記事 slug ごとの OGP 画像生成ルート。
- `README.md`
  - OGP 自動生成の概要を追記する場合のみ更新。

### Task 1: Add OGP image generation dependency

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`

- [ ] **Step 1: Add the package dependency**

Add this dependency entry to `package.json`:

```json
{
  "dependencies": {
    "astro-og-canvas": "^0.11.0"
  }
}
```

Keep existing Astro-related dependencies unchanged.

- [ ] **Step 2: Install the dependency with Bun**

Run: `bun install`
Expected: lockfile updated and `astro-og-canvas` added with no install errors.

- [ ] **Step 3: Verify dependency is recorded**

Run: `rg -n "astro-og-canvas" package.json bun.lock`
Expected: hits in both `package.json` and `bun.lock`.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock
git commit -m "build: add og image generation dependency"
```

### Task 2: Add layout support for OGP and Twitter meta

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Extend props with OGP fields**

Update the props interface and defaults to include:

```ts
interface Props {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

const {
  title = 'asazutaiga.dev',
  description = 'Asazu Taiga notes',
  ogTitle = title,
  ogImage,
  ogType = 'website',
} = Astro.props;
```

- [ ] **Step 2: Compute absolute URLs for meta output**

Add this directly after `canonical`:

```ts
const site = Astro.site ?? 'https://asazutaiga.dev';
const ogImageUrl = ogImage ? new URL(ogImage, site).toString() : undefined;
```

- [ ] **Step 3: Add Open Graph and Twitter meta tags**

Insert these tags inside `<head>` after the description/canonical tags:

```astro
<meta property="og:title" content={ogTitle} />
<meta property="og:description" content={description} />
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonical.toString()} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={ogTitle} />
<meta name="twitter:description" content={description} />
{ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
{ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
```

- [ ] **Step 4: Run build to verify Astro head rendering still works**

Run: `bun run build`
Expected: build succeeds with no Astro template errors.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add og meta support to base layout"
```

### Task 3: Pass article-specific OGP metadata from note pages

**Files:**
- Modify: `src/pages/notes/[slug].astro`

- [ ] **Step 1: Compute per-post OGP path**

Add this near `displayTitle`:

```ts
const ogImage = `/og/${post.id}.png`;
```

- [ ] **Step 2: Pass article meta props into the layout**

Update the layout usage to:

```astro
<BaseLayout
  title={`${displayTitle} | asazutaiga.dev`}
  description={post.data.title}
  ogTitle={post.data.title}
  ogType="article"
  ogImage={ogImage}
>
```

- [ ] **Step 3: Build and inspect generated HTML**

Run: `bun run build`
Expected: success.

Run: `rg -n "og:image|twitter:image|og:type" dist/notes/new-blog-2026/index.html`
Expected: article page HTML includes `og:type` and `/og/new-blog-2026.png`.

- [ ] **Step 4: Commit**

```bash
git add 'src/pages/notes/[slug].astro'
git commit -m "feat: wire article og metadata"
```

### Task 4: Create static OGP image route

**Files:**
- Create: `src/pages/og/[slug].png.ts`

- [ ] **Step 1: Create the route skeleton**

Start with this file structure:

```ts
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const posts = await getCollection('posts');
const pages = Object.fromEntries(
  posts.map((post) => [
    post.id,
    {
      title: post.data.title,
    },
  ]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'slug',
  pages,
  getSlug: (path) => path,
  getImageOptions: (_path, page) => ({
    title: page.title,
    bgGradient: [
      [250, 247, 242],
      [245, 239, 230],
    ],
    border: {
      color: [216, 120, 41],
      width: 10,
      side: 'block-end',
    },
    padding: 72,
    font: {
      title: {
        families: ['Noto Serif JP'],
        weight: 'Bold',
        color: [66, 46, 31],
        size: 68,
        lineHeight: 1.24,
      },
    },
    fonts: [
      'https://fonts.gstatic.com/s/notoserifjp/v33/xn71YHs72GKoTvER4Gn3b5eMRtWGkp6o7MjQ2bzWPebA.ttf',
    ],
  }),
});
```

If the package API differs, follow the official package docs, but preserve these constraints:
- input is title only
- white/warm background
- orange accent line
- no archived label
- route output is `/og/<slug>.png`

- [ ] **Step 2: Remove unused decorative fields if the package does not need them**

Keep the route minimal. If `description`, `logo`, or similar fields are unnecessary, remove them rather than working around them.

- [ ] **Step 3: Run build and verify OGP images are generated**

Run: `bun run build`
Expected: success.

Run: `find dist/og -type f | sort`
Expected: one `.png` per article, including `dist/og/new-blog-2026.png`.

- [ ] **Step 4: Spot-check one file exists and is non-empty**

Run: `ls -lh dist/og/new-blog-2026.png`
Expected: file exists and size is greater than 0 bytes.

- [ ] **Step 5: Commit**

```bash
git add 'src/pages/og/[slug].png.ts'
git commit -m "feat: generate per-post og images"
```

### Task 5: Document the new behavior

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a short OGP note to the README**

Add a short bullet under the route/feature explanation such as:

```md
- `/og/[slug].png` : 記事タイトルから OGP 画像をビルド時に自動生成
```

- [ ] **Step 2: Re-run build after docs change**

Run: `bun run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: note automatic og image generation"
```

### Task 6: Final verification

**Files:**
- No source changes required unless a verification issue is found.

- [ ] **Step 1: Run the full verification set**

Run: `bun test`
Expected: all tests pass.

Run: `bun run build`
Expected: build succeeds and generates OGP files.

- [ ] **Step 2: Verify article HTML references the generated image**

Run: `rg -n "og:image|twitter:image" dist/notes/new-blog-2026/index.html`
Expected: absolute or root-relative reference to `/og/new-blog-2026.png` appears in both meta tags.

- [ ] **Step 3: Verify the generated image list count matches article count**

Run: `find dist/og -name '*.png' | wc -l && find src/content/posts -maxdepth 1 -type f \( -name '*.md' -o -name '*.mdx' \) | wc -l`
Expected: the two counts match.

- [ ] **Step 4: Commit any final verification-driven fixes**

```bash
git add -A
git commit -m "test: verify og image generation"
```

## Self-Review

- Spec coverage: route generation, metadata wiring, visual constraints, and build verification are each covered by a dedicated task.
- Placeholder scan: all tasks include explicit files, commands, and expected outcomes.
- Type consistency: `ogImage` and `ogType` are introduced in layout first, then consumed in note pages; OGP route consistently keys on `slug`/`post.id`.
