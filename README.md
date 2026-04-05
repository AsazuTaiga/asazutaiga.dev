# asazutaiga.dev

Astro で再構築した個人ブログです。

## Tech Stack

- Astro (static)
- Content Collections (`src/content/posts`)
- Bun (`packageManager: bun@1.3.11`)

## Routes

- `/` : 過去365日以内の記事を新着順で最大20件
- `/notes` : 全記事を年別で一覧表示
- `/notes/[slug]` : 記事詳細
- `/post/[slug]` : `/notes/[slug]` へリダイレクト（preview時はHTML redirect、Vercelでは `vercel.json` により恒久リダイレクト）
- `/og/[slug].png` : 記事タイトルから OGP 画像をビルド時に自動生成
- `/rss.xml` : RSS

## Local Development

```bash
bun install
bun run dev
```

## Test

```bash
bun test
```

## Build

```bash
bun run build
bun run preview
```

## Post Authoring

記事は `src/content/posts/*.md` に配置します。frontmatter 必須項目は次の2つだけです。

```md
---
title: "記事タイトル"
createdAt: "2026-04-05"
---
```

`createdAt` は `YYYY-MM-DD` 形式です。
