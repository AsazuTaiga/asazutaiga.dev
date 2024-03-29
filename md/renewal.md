---
emoji: "📚"
title: "ブログをリニューアルしました"
createdAt: "2021/07/31"
updatedAt: "2021/07/31"
published: true
genre: "tech"
tags: ["blog"]
---

# ブログを作りました（N回目）

適当な技術を試したり、SSGするのにブログというコンテンツは無茶苦茶向いている気がします。
なので、何回もブログを作ってしまうのですよね。許してくれ。

## 使っている技術

Next.js + TypeScript構成はいつもの感じですが、tailwindcssを使ってます。

tailwindcssはgradientを簡単に作れるのも魅力の一つですが、今回はそもそもフラットなデザインにしたかったのでgradientは使っていません。残念。
ただ、やっぱりユーティリティの組み合わせでデザインデータにある程度近いものを作れるのは便利。
tailwind.config.jsをうまく使えば、それだけでtailwindを土台にデザインシステム的なものを作れるっぽいので、いいですよね。

コンテンツについては、CMSは使わず、リポジトリ内にそのままmdファイルを置いてビルド時にSSGしてます。
いろいろ構成考えましたが、結局これが一番シンプルでいいですね。

コードブロックのシンタックスハイライトはまだ入れてないので、そのうち入れます。

markdownのmetaの部分に、絵文字やタイトルや作成日を入れているのですが、これを変換するために[markdown-yaml-metadata-parser](https://github.com/ilterra/markdown-yaml-metadata-parser)というライブラリを使わせてもらってます。ミニマムな機能が提供されていてとてもいいのですが、型情報がないので、d.tsを自分で書きました。[このブログのリポジトリ](https://github.com/AsazuTaiga/tailwind-next-blog)の中に置いているので、どうせなら@typesとかにPR送ってみようかな……と思いつつ結構めんどくさそうなので二の足を踏んでます😢

（何か他に書くべきこと思い出したら追記します）

# 追記

シンタックスハイライトできるようにしました。
markdownのレンダリングは[react-markdwon](https://github.com/remarkjs/react-markdown)を使っていて、これに[react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)を組み合わせてます。

ほぼ公式で紹介されてるやり方そのままですが、力業感がありますね。

```tsx
// CodeBlock.tsx
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import { useTheme } from '../hooks/useTheme'

type Props = {
  language?: string
  value: string
}

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('json', json)

export const CodeBlock: React.VFC<Props> = ({ language, value }) => {
  const { theme } = useTheme()
  const style = theme === 'light' ? vs : vscDarkPlus
  return (
    <SyntaxHighlighter language={language} style={style}>
      {value}
    </SyntaxHighlighter>
  )
}

```

```tsx
// [slug].tsx
// いろいろ省略
// ...
    <Markdown
      components={{
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <CodeBlock
              language={match[1]}
              value={children.toString().replace(/\n$/, '')}
            />
          ) : (
            <code className={className}>{children}</code>
          )
        },
      }}
    >
      {post.content}
    </Markdown>
// ...
```