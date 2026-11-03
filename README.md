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

### 画像ギャラリー

コンポーネントを使う記事は `.mdx` で保存します。
画像は `public/posts/` 以下に配置し、`public` を省いた URL を指定します。

```mdx
import Gallery from '../../components/Gallery.astro';

<Gallery images={[
  { src: '/posts/example/photo1.jpg', alt: '写真1の説明' },
  { src: '/posts/example/photo2.jpg', alt: '写真2の説明' },
]} />
```

3列の正方形サムネイルで表示します（9枚で3×3）。クリックすると元の比率で拡大し、閉じるボタン・背景クリック・Esc で閉じられます。

### R2 に写真を保存する

元画像は `.media/<記事ID>/` に配置します。元画像と生成した `.media-cache/` は Git 管理対象外です。元画像は別途バックアップしてください。

```bash
bun run media:prepare tobacco-and-salt-museum
bun run dev
```

`media:prepare` は長辺480pxと1920pxの WebP を生成します（拡大なし、向きを補正、EXIFを除去）。生成済みの一覧は `src/data/galleries/<記事ID>.json` に保存されます。配列の順序と `alt` は編集でき、再実行時にも保持します。新しい写真はファイル名順で末尾に追加します。既存の元画像が消えていた場合は、一覧を書き換えず停止します。写真を一覧から外す場合は、元画像を退避し、一覧の対応項目も手動で外してください。

```mdx
import Gallery from '../../components/Gallery.astro';
import photos from '../../data/galleries/tobacco-and-salt-museum.json';

<Gallery images={photos} />

{/* 本文の合間に分けて配置することもできます */}
<Gallery images={photos.slice(0, 12)} initialCount={9} />
```

Gallery は9枚ずつ表示し、未表示のサムネイルには読み込み URL を設定しません。拡大用画像はクリック時だけ取得し、前後ボタン・左右キーで移動できます。開発中は `.media-cache/` の画像を `/media/` 経由で配信し、ビルド成果物には画像をコピーしません。

画像一覧がある記事には `/notes/<記事ID>/gallery` を生成します。全写真のサムネイルを遅延読み込みで表示し、クリックで拡大できます。記事側で `galleryHref="/notes/<記事ID>/gallery"` を指定すると、最初の9枚と全写真ページへのリンクを表示します。

R2 の初期設定:

1. Cloudflare で公開する写真専用の R2 バケットを作成します（Standard）。
2. バケットに `images.asazutaiga.dev` などの独自ドメインを接続します。同じアカウントでドメインのゾーンを管理できる必要があります。ブログ本体のホスティングは維持できます。
3. 対象バケットだけに Object Read & Write 権限を持つ S3 API のアクセスキーを作成します。汎用 Cloudflare API トークンとは別です。
4. `.env.example` を `.env.local` にコピーして5項目を設定します。`.env.local` は Git に含めません。
5. ホスティング側にも公開情報の `PUBLIC_MEDIA_BASE_URL` だけ設定します。R2 の秘密鍵はビルドや閲覧には不要です。

```bash
# 通信せず生成ファイルと一覧を確認
bun run media:upload tobacco-and-salt-museum --dry-run

# 画像を先に公開。存在するオブジェクトはスキップし、削除は行わない
bun run media:upload tobacco-and-salt-museum

# 記事・画像一覧・コードをコミットして公開
bun run build
```

ファイル名は生成画像の SHA-256 を含み、変更画像は別 URL になります。画像には1年間の immutable キャッシュを指定します。不要な古い画像は自動削除しません。R2 の認証エラーは既存画像扱いで無視せず停止します。画像が未アップロードのまま記事を公開しないでください。

本番ビルドは `PUBLIC_MEDIA_BASE_URL` が未設定だと停止します。開発は R2 未設定でも動きます。新しくチェックアウトした環境では、元画像を戻して `media:prepare` を実行するとローカルプレビューできます。

既に R2 の `<記事ID>/` に元画像を手動アップロードしている場合は、以下で取り込めます。既存ローカル画像は上書きせず、R2 側のファイルも変更しません。

```bash
bun run media:pull tobacco-and-salt-museum
bun run media:prepare tobacco-and-salt-museum
bun run media:upload tobacco-and-salt-museum
```

手動アップロードした元画像はそのまま残し、生成画像だけ `galleries/<記事ID>/` に追加します。`r2.dev` は開発確認用に利用できますが、本番運用では独自ドメインに切り替えてください。

参考: [R2 公開バケット](https://developers.cloudflare.com/r2/buckets/public-buckets/) / [S3 API のキー](https://developers.cloudflare.com/r2/api/tokens/)
