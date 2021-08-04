---
emoji: "💙"
title: "axios.getの<T>を必須にしたいなあと思った話"
createdAt: "2021/08/05"
updatedAt: "2021/08/05"
genre: "tech"
tags: ["TypeScript"]
---

# 型引数を必須にしたい

いつも通りaxios.get()を書いているときにふと思いました。「型引数のTを必須にすれば、このanyを消せるのでは？」と。

```tsx
const asyncFunction = async () => {
  const response = await axios.get('/path/to/endpoint')
  const data = response.data // any 😢
  const foo = data.foo // 型エラーにはならないけど、fooはundefinedかもしれない
  // ...
}
```

Ｔを指定し忘れたのか、意図的に指定しなかったのかは分かりませんが、dataがanyになってしまいました。これを防ぐためには「Ｔを指定し忘れたらエラーになるようにする」のが手っ取り早そうです。

## ネットの知恵

※ここではaxiosのことは一旦忘れてください。

「typescript require generic」でググったら、以下のStackOverflowを見つけました。

[javascript - TypeScript require generic parameter to be provided - Stack Overflow](https://stackoverflow.com/questions/51173191/typescript-require-generic-parameter-to-be-provided)

最も票を集めているのは以下の回答です。（執筆時点）

> There is no built-in support for this, we can however engineer a scenario where not passing in a type parameter will generate an error, using default generic type arguments and conditional types. Namely we will give U a default value of void. If the default value is the actual value of U, then we will type the parameter to the function as something that should not really be passed in so as to get an error:
>
> （拙訳）この問題に対する（TypeScriptの）組み込みのサポートはありません。しかし、型パラメータが渡されたなかった場合にエラーを生成するシナリオを、デフォルト型引数とconditional types（条件付き型付け）を使って作ることができます。（以下の例では）デフォルト値がUの実際の値である場合、関数のパラメータを、実際には渡すべきでないものとして型付けし、エラーになるようにします。

```tsx
async function get<U = void>(url: string & (U extends void ? "You must provide a type parameter" : string)): Promise<U> {
    return null as any;
}

get('/user-url'); // Error Argument of type '"/user-url"' is not assignable to parameter of type '"You must provide a type parameter"'.

class User {}
get<User>('/user-url');
```

日本語だと「型 '"/user-url"' の引数を型 '"You must provide a type parameter"' のパラメーターに割り当てることはできません。ts(2345)」みたいなエラーになりますね。

なるほど。泥臭さはあるけど、悪くないかも……って感じですね。

# そもそもなぜ型引数を省略するとanyになる（ことが多い）のか

見方を変えればこれは問題でもなんでもないのでは？というのが以下の話です。（なので、個人的には↑のやり方は推奨しません。紹介しといてなんだって話ですが）

[TypeScript: Documentation - Generics - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)

上に挙げたStackOverflowの例でも使われているのが、Generic Constratnts（制約付きジェネリクス）です。

もしanyを許容したくないのであれば、そもそも「こういう型を拡張した型引数以外は受け付けませんよ」と明示すればいいわけなので、適切にGeneric Constraintsを書くべきなわけです。

## なぜaxios.getは<T>のConstraintsを指定しないのか

ここでちょっとaxiosの気持ちを想像してみたのですが、「なぜ<T extends unknow>にしないのか？」がちょっと分かりませんでした。

どんなレスポンスボディが返ってくるのか、あるいはvoid（空）なのかということは、axios側では知る由がない外の世界の話です。なので、Constraintsを厳密に指定できないのは当然です。しかし、unknown型はプロパティアクセスをする前に型の検査が必要となるので、より型安全です。もし使われていない理由があるとしたら、unknownがTypeScript 3.0移行に導入されたものだから対応が漏れている（あるいはbreaking changesになるから入れられていない）くらいしかないかな、と予想しました。

疑念を持ちつつGitHubのissueを覗いてみたら、過去に同じことを考えている人がいたみたいです。ただし、残念ながらプロジェクトテンプレートに従っていないので、botによりcloseされていました。

[Use unknown type instead of any for Typescript definitions of response types #3313](https://github.com/axios/axios/issues/3313)

着眼点はいいのにこれはもったいないと思ったので、せこせこと文章とサンプルコードを用意し、issueを立てることにしました。「[Project dead? #3930](https://github.com/axios/axios/issues/3930)」という物騒なissueが立てられたりもしてるので、回答が来るかは分かりませんが、試しに…という感じです。

[Use unknown type instead of any for Typescript definitions of response types #3933](https://github.com/axios/axios/issues/3933)

これがどういった経過をたどるか分かりませんが、しばらく観察してみようと思います。
botにcloseされたら泣きます。
