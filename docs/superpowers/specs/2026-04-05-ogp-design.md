# OGP Design

- Date: 2026-04-05
- Repo: `/Users/asazu/work/asazutaiga.dev`
- Scope: 記事ごとの自動 OGP 生成を追加する
- Out of Scope: 記事本文や一覧 UI の変更、Archived 表示の OGP 反映、手動画像管理

## Purpose

記事ごとに個別の OGP 画像を自動生成し、`/notes/[slug]` の共有時に記事タイトルに対応した画像が出るようにする。運用負荷を増やさず、現在の Astro + Bun + Content Collections 構成のまま閉じることを優先する。

## Decisions

1. 画像は記事ごとに自動生成する。
2. OGP の見た目はタイトル中心のミニマル構成にする。
3. 背景は白ベース + 薄い紙っぽさ + オレンジ系アクセントにする。
4. 旧記事でも OGP には `Archived` 表示を入れない。
5. 実装方式は Astro の動的 PNG 生成ルートを使う。

## Architecture

### Route generation

- `src/pages/og/[slug].png.ts` を追加する。
- `getStaticPaths()` で `posts` collection の全記事 slug を列挙する。
- 各 slug に対して `/og/<slug>.png` をビルド時生成する。

### Rendering

- OGP 画像生成には `astro-og-canvas` を使う。
- 画像サイズは `1200x630`。
- 入力は記事タイトルのみとし、日付、タグ、Archived 表示、サムネイル画像は入れない。

### Metadata wiring

- `BaseLayout.astro` に以下の props を追加する。
  - `ogTitle?: string`
  - `ogImage?: string`
  - `ogType?: 'website' | 'article'`
- 共通で出す meta:
  - `og:title`
  - `og:description`
  - `og:type`
  - `twitter:card=summary_large_image`
  - `twitter:title`
  - `twitter:description`
- `ogImage` が指定されたときだけ以下を出す。
  - `og:image`
  - `twitter:image`
- `/notes/[slug]` では `ogTitle` に記事の生タイトルを渡し、`ogType='article'` と `ogImage='/og/<slug>.png'` を渡す。
- `/` と `/notes` は今回は共通 meta のままにする。

## Visual spec

- 背景色: 白ベース、わずかに暖かい紙色
- テキスト色: 濃いブラウン寄り
- アクセント: オレンジの細いラインを1本
- レイアウト: 広めの余白、やや左寄せ、タイトルを主役にする
- タイポグラフィ: 明朝系を第一候補とし、可読性優先で太さはやや強め
- 長いタイトルは2〜4行程度に折り返す

## Error handling

- slug に対応する記事が見つからない場合、該当 OGP ルートは生成しない。
- タイトルが空のケースは content schema でビルド失敗になるため、OGP 側で特別処理は持たない。
- OGP 生成に必要な依存が不足している場合は `bun run build` で失敗させる。

## Testing

- `bun run build` で以下を確認する。
  - `/og/<slug>.png` が記事ごとに生成される
  - `/notes/[slug]` の meta に個別 OGP URL が入る
- 必要なら最小のユニットテストを追加するが、まずは build 成功と出力確認を優先する。

## Planned file touches

- `package.json`
- `src/layouts/BaseLayout.astro`
- `src/pages/notes/[slug].astro`
- `src/pages/og/[slug].png.ts`
- 必要なら `README.md`

## Rationale

- 現在の要件は「記事ごと」「自動」「ミニマル」であり、ビルド時に静的生成できる構成が最も合う。
- Vercel OG のような runtime 依存は今回のスコープでは不要。
- 画像をファイルとして事前生成するスクリプト方式より、Astro route に閉じた方が保守対象が少ない。
