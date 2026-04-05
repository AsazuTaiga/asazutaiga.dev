# asazutaiga.dev ブログ全面再構築（Astro + MDX + Bun）

この ExecPlan は living document です。実装の進行に合わせて `Progress`、`Surprises & Discoveries`、`Decision Log`、`Outcomes & Retrospective` を更新し続けます。

本リポジトリには `PLANS.md` は存在しないため、グローバルの `~/.codex/PLANS.md` に準拠して本書を管理します。

## Purpose / Big Picture

この変更で、古い Next.js ベースのブログを、軽量で更新しやすい Astro ベースに全面置換します。読者はホームで直近1年の投稿（最大20件）を素早く読め、過去記事は `/notes` で年ごとに探索できます。執筆者は `title` と `createdAt` だけで記事を追加でき、必須項目が少ないため公開までの心理的ハードルを下げられます。

動作確認は、ローカルで `bun run dev` を起動し、`/`、`/notes`、`/notes/[slug]`、旧URL `/post/[slug]` のリダイレクトを確認することで行います。

## Progress

- [x] (2026-04-05 10:34 JST) 現行構成を調査し、Next.js pages router + local markdown 運用であることを確認。
- [x] (2026-04-05 10:34 JST) 技術スタックを Astro SSG + MDX + Content Collections に決定。
- [x] (2026-04-05 10:34 JST) 記事の正本はローカル管理継続、既存UIは移植しない方針に決定。
- [x] (2026-04-05 10:34 JST) 情報設計を確定（`/`、`/notes`、`/notes/[slug]`、`/post/[slug]` 301）。
- [x] (2026-04-05 10:34 JST) 表示要件を確定（ホームはJST基準で過去365日以内、最大20件）。
- [x] (2026-04-05 10:34 JST) frontmatter 最小化を確定（必須: `title`, `createdAt`、`createdAt` は `YYYY-MM-DD`）。
- [x] (2026-04-05 10:34 JST) 実行環境を Bun 前提に確定（ローカル/デプロイともに Bun）。
- [x] (2026-04-05 10:44 JST) Astro プロジェクトへ移行し、旧 Next.js ルーティング/実装を除去。
- [x] (2026-04-05 10:44 JST) 公開済み記事12本を `src/content/posts/*.md` へ移行し、`title`/`createdAt` 最小 frontmatter に正規化。
- [x] (2026-04-05 10:44 JST) `/`、`/notes`、`/notes/[slug]`、RSS/sitemap を実装し、`bun test` と `bun run build` を成功確認。

## Surprises & Discoveries

- Observation: 「Latest 10件」と同ページ内の「より古い記事」を同居させると、情報軸が割れてUI意図が不明瞭になる。
  Evidence: 設計対話で、ユーザーが「歪みを感じる」と明示。ホームと過去記事一覧を分離する方針に変更。

- Observation: `pinned` 運用は軽量更新の目的に反し、更新停止要因になりやすい。
  Evidence: ユーザー判断で `pinned` 案を撤回し、`createdAt` 降順のみへ単純化。

- Observation: Astro static の redirect は preview では HTTP 200 + HTML redirect 表現になる。
  Evidence: `curl -I http://127.0.0.1:4321/post/renewal` で 200 を確認し、`vercel.json` に恒久リダイレクトを追加してデプロイ時 301 を担保。

## Decision Log

- Decision: デザインは既存移植を行わず全面再設計とする。
  Rationale: 古い設計制約を切り離し、軽量で再出発するため。
  Date/Author: 2026-04-05 / User + Codex

- Decision: 記事詳細の正規URLは `/notes/[slug]` とし、`/post/[slug]` は 301 リダイレクトにする。
  Rationale: 情報設計上の用語を `notes` に統一しつつ、旧リンク互換を維持するため。
  Date/Author: 2026-04-05 / User + Codex

- Decision: ホームは「JST基準で過去365日以内」かつ「最大20件」を表示する。
  Rationale: 最新性を維持しつつ、一覧過多を防いで可読性を確保するため。
  Date/Author: 2026-04-05 / User + Codex

- Decision: frontmatter の必須項目は `title` と `createdAt` のみ。
  Rationale: 入力負荷を最小化し、投稿停止の要因を除去するため。
  Date/Author: 2026-04-05 / User + Codex

- Decision: パッケージ管理/実行は Bun 前提に統一し、バージョン固定を行う。
  Rationale: 開発体験と実行速度の向上を狙い、運用の前提を明示するため。
  Date/Author: 2026-04-05 / User + Codex

- Decision: コンテンツ拡張子は `.md` を標準とし、MDX は必要時のみ追加する。
  Rationale: 既存記事の記法をそのまま移行しつつ、将来の MDX 拡張余地を残すため。
  Date/Author: 2026-04-05 / User + Codex

## Outcomes & Retrospective

主要成果は、Next.js ベース実装を Astro SSG へ置換し、合意した IA をそのまま動作させたことです。`/` は「過去365日・最大20件」、`/notes` は年別一覧、`/notes/[slug]` は本文表示、`/rss.xml` と sitemap も生成されます。`/post/[slug]` 互換は Astro redirect + Vercel redirect 設定で維持しました。残課題はデプロイ環境での 301 実ステータス確認のみです。

## Context and Orientation

現行リポジトリは Next.js pages router 構成です。主要ファイルは `pages/index.tsx`、`pages/post/[slug].tsx`、`utils/post.ts`、`utils/rss.ts`、`md/*.md` です。投稿は `md/` 直下の Markdown から読み込み、記事一覧と詳細を静的生成しています。

本計画では、Next.js 構成を Astro へ置換します。Astro は静的HTMLを事前生成するフレームワークです。Content Collections は `src/content` 配下の記事に型（スキーマ）を与え、frontmatter不備をビルド時に検知する仕組みです。MDX は Markdown にコンポーネント埋め込み能力を追加した形式ですが、本計画では「使えるが必須ではない」扱いにします。

## Plan of Work

まず Astro + MDX + Content Collections を導入し、Bun で実行できる基本構成を作ります。既存の Next.js ページとユーティリティは段階的に置換し、最終的に不要コードを削除します。

次に記事データの正本を `src/content/posts/**/*.{md,mdx}` に移し、`title` と `createdAt` だけを必須とするスキーマを定義します。`createdAt` は `YYYY-MM-DD` を受け取り、日付として解釈できない場合はビルド失敗にします。ホーム用の抜粋は本文先頭から自動抽出し、frontmatter追加を要求しません。

ルーティングは `/`、`/notes`、`/notes/[slug]` を実装し、`/post/[slug]` 互換のための301を設定します。ホームは JST でのビルド日時から365日以内の記事を抽出し、新しい順で最大20件表示します。`/notes` は全記事を年単位で縦並び表示します。

最後に RSS と sitemap を Astro 側で生成し、Bun 前提の実行コマンドへ統一します。検証では各ページ導線、301挙動、ビルド成功、RSS/sitemap 出力を確認します。

## Concrete Steps

作業ディレクトリは `/Users/asazu/work/asazutaiga.dev` とします。

1. Bun 前提の Astro プロジェクト構成を作る。
2. `src/content.config.ts` を作成し、posts collection のスキーマを定義する。
3. `src/content/posts/` に記事を移行し、`title` と `createdAt` 形式をそろえる。
4. `src/pages/index.astro`（または同等のルート）でホーム一覧（過去365日・最大20件）を実装する。
5. `src/pages/notes/index.astro` で年別縦並び一覧を実装する。
6. `src/pages/notes/[slug].astro` で記事詳細を実装する。
7. `astro.config.mjs` の redirect と `vercel.json` で `/post/[slug]` -> `/notes/[slug]` を維持する。
8. RSS/sitemap 生成設定を追加する。
9. Bun コマンドで dev/build/preview を確認する。

想定コマンド（実装時に実行）:

    bun install
    bun run dev
    bun run build
    bun run preview

## Validation and Acceptance

受け入れ条件は次の通りです。

- `bun run build` が成功し、frontmatter不備がある場合は明示的に失敗する。
- `/` で「過去365日以内の記事のみ」が新着順で表示され、件数は最大20件。
- `/notes` で全記事が年見出しごとに表示される。
- `/notes/[slug]` で記事本文が表示される。
- `/post/[slug]` 互換が維持される（Astro preview では HTML redirect、デプロイでは `vercel.json` により恒久リダイレクト）。
- RSS と sitemap が生成され、主要URLを含む。

## Idempotence and Recovery

この移行は段階的に進め、各段階で `bun run build` を通すことで中断復帰を容易にします。記事移行はファイルコピー主体にし、元の `md/` をすぐ削除せず比較可能な状態で進めます。リダイレクト設定が崩れた場合は `/post/[slug]` のルーティング実装のみを最小差分で戻せるように独立管理します。

## Artifacts and Notes

初期調査で確認した主要事実:

    - 現行は Next.js pages router（pages/index.tsx, pages/post/[slug].tsx）
    - 記事は md/*.md のローカルファイル読み込み（utils/post.ts）
    - package.json は Bun 実行前提に更新済み（`packageManager` 固定）

設計確定事項（対話合意）:

    - 記事正本はローカル管理継続
    - デザインは全面再設計（既存UI移植なし）
    - 正規記事URLは /notes/[slug]
    - ホームは過去1年以内の最大20件
    - 必須frontmatterは title と createdAt のみ

## Interfaces and Dependencies

採用する主要依存は Astro、MDX、Content Collections、RSS/sitemap 生成プラグインです。Bun を実行環境として固定し、`package.json` に `packageManager` を明記します。

最終的に必要なインターフェース:

- 記事スキーマ: `title: string`, `createdAt: string`（`YYYY-MM-DD` 入力）
- 一覧取得関数: 全記事取得、最新順ソート、ホーム用フィルター（365日以内・20件上限）
- ルート: `/`, `/notes`, `/notes/[slug]`, `/post/[slug]`(301)
- 出力: HTML静的生成、`/rss.xml`、`/sitemap-index.xml`（または同等）

---

Revision Note (2026-04-05): 初版作成。対話で確定した IA / URL / frontmatter 最小化 / Bun 前提 / 検証条件を自己完結で記録した。
Revision Note (2026-04-05): 実装完了に合わせて Progress/Discoveries/Decision/Outcomes を更新し、redirect 実挙動（preview と deploy の差）を追記した。
