---
emoji: "🦈"
title: "Next.jsで任意のファイル保存時にホットリロード"
createdAt: "2021/08/07"
updatedAt: "2024/04/01"
published: true
genre: "tech"
tags: ["Next.js"]
---

# 追記（2024/04/01）

このブログのホットリロード方法を、`next-remote-watch` から、自前の（といっても[Dan先生が使っているもの](https://github.com/gaearon/overreacted.io/pull/797)をほぼパクった）スクリプトでwebsocketを使ってやる方法に置き換えてます。

以下の記事はアーカイブとして残しますが、同様の方法を推奨するものではありません。

---

ローカルのmarkdownファイルをSSGする形でブログを書いていると、こんなことを思いました。「mdファイルを更新したら画面がリロードされてほしいな～」と。書くのが楽になることは、ブログを続ける秘訣かもですし。

調べてみたら、`next-remote-watch`というライブラリを使用することで簡単に実現できたのでご紹介します。

[hashicorp/next-remote-watch: Decorated local server for next.js that enables reloads from remote data changes](https://github.com/hashicorp/next-remote-watch)

今のところmarkdownファイルの変更検知以外の使い道を思いついていませんが、Next.jsがデフォルトでホットリロードしてくれるjs/ts/css等以外のファイルベースでホットリロードをしたいときには、役に立つかもしれません。

# 環境

```json
{
  "name": "tailwind-headlessui-next-blog",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@headlessui/react": "^1.4.0",
    "axios": "^0.21.1",
    "dayjs": "^1.10.6",
    "markdown-yaml-metadata-parser": "^3.0.0",
    "next": "11.0.1",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "react-markdown": "^6.0.3",
    "react-syntax-highlighter": "^15.4.4",
    "remark-gfm": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "17.0.15",
    "@types/react-syntax-highlighter": "^13.5.2",
    "autoprefixer": "^10.3.1",
    "next-remote-watch": "^1.0.0",
    "postcss": "^8.3.6",
    "tailwindcss": "^2.2.7",
    "typescript": "4.3.5"
  }
}
```

# 導入

## パッケージインストール

```json
npm i -D next-remote-watch
```

## `next dev`コマンドを置き換える

```json
   "scripts": {
 -   "dev": "next dev",
 +   "dev": "next-remote-watch md"
```

`md`の部分は、検知の対象にしたいディレクトリ or ファイルを指定して下さい。
これで導入はあっさり完了。後はいつも通り`npm run dev`して記事を書きながらブラウザでプレビューしてけばよいです。

---

# 余談

## 内部的には`chokidar`を使ってるっぽい

`chokidar`は、ファイルの変更を監視するNode.jsライブラリです。

以下の箇所で、`chokidar`によるファイル監視と、イベント駆動でのホットリロードの発火がざっくりつかめる気がしますね。

[next-remote-watch/next-remote-watch at 6767289c23368ce5d604bd6c60aa0deb63588403 · hashicorp/next-remote-watch](https://github.com/hashicorp/next-remote-watch/blob/6767289c23368ce5d604bd6c60aa0deb63588403/bin/next-remote-watch#L44)

```ts
app.prepare().then(() => {
  // if directories are provided, watch them for changes and trigger reload
  if (program.args.length > 0) {
    chokidar
      .watch(program.args, { usePolling: Boolean(program.polling) })
      .on(
        program.event,
        async (filePathContext, eventContext = defaultWatchEvent) => {
          app.server.hotReloader.send('building')
          // 中略 by @asazutaiga
          app.server.hotReloader.send('reloadPage')
        }
      )
  }
  // 以下略 by @asazutaiga
```

この場合は、Next.jsのアプリケーション全体を再ビルドしているみたいですね。

## `zenn-editor`のプレビューって爆速だしなんか違うのかな？→websocketだった

`zenn-editor`のmd保存時のプレビュー反映がめっちゃ速くて心地よいと常々思っていましたが、`next-remote-watch`をポン載せしてアプリ全体を再ビルドしている場合と比較してみると一目瞭然でした。
どうやら、こちらも`chokidar`でファイル監視をしつつ、変更があった場合にはNext.jsの再ビルドを走らせるのではなく、`socket.io`を使ってwebsocket経由で変更反映しているようです。そりゃ速いわけだ！なっとく。

[zenn-editor/index.ts at 7711dac082923a409713d1f17514949f3f8bfa31 · zenn-dev/zenn-editor](https://github.com/zenn-dev/zenn-editor/blob/7711dac082923a409713d1f17514949f3f8bfa31/packages/zenn-cli/cli/preview/index.ts#L54)

```ts
  if (shouldWatch) {
    const watcher = chokidar.watch(`${process.cwd()}/{articles,books}/**/*`);
    const io = new Server(server);
    watcher.on('change', () => {
      io.emit('reload');
    });

    process.on('SIGINT', function () {
      // `Ctrl-C`の signalを奪って正常終了させる.
      io.close();
      watcher.close();
      process.exit();
    });
  }
  if (shouldOpen) open(previewUrl);
};
```

## ホットリロードってすごいよね

もはやWebフロントエンドの開発では当たり前になっているホットリロード。というか、HMRやらFast Refreshの登場でむしろ愚直すぎるような気もするホットリロード。

jQueryをCDNから読み込んでHTMLを直接操作していた右も左もわからないフロント迷子のころ（といっても1年半前くらい）は、「ホットリロードってスゲー！」という感動がありました。だって、エディタでファイルを保存した後に、わざわざブラウザの更新ボタン押さなくてよいんですよ？

私がホットリロードに最初に触れたのは、VSCodeの[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)という拡張機能です。素のHTML＋JSやjQueryで作られたLPをちょっと触るときとかに、あると便利です。

これに、同じ作者の[Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass)を組み合わせてもいい感じに作業ができた思い出。

（……まあ、前職で最後にいたjQuery製Webアプリの現場は、認証の関係でAPIからデータを取ってくる手段がないのでローカルサーバでの作業ができず、いちいち開発用のサーバのディレクトリを作っては手動アップロードする必要があるとかいう激ヤバ環境だったんですが。）

# React開発環境におけるホットリロード（および類似機能）にかかわるリンク集

3連休だし、読もう。

## Hot Module Replacement (Webpack)

[Hot Module Replacement | webpack](https://webpack.js.org/concepts/hot-module-replacement/)

## React Refresh

ドキュメント見当たらず。Fast RefreshについてのDan先生のIssueコメントのリンクが[npmのreact-refreshのページ](https://www.npmjs.com/package/react-refresh)に貼られてた。

["How should we set up apps for HMR now that Fast Refresh replaces react-hot-loader? · Issue #16604 · facebook/react #issuecomment-528663101](https://github.com/facebook/react/issues/16604#issuecomment-528663101)


## Fast Refresh（Next.js）

[Basic Features: Fast Refresh | Next.js](https://nextjs.org/docs/basic-features/fast-refresh)



