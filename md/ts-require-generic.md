---
emoji: "💙"
title: "axios.getの<T>を必須にしたいなあと思った話"
createdAt: "2021/08/05"
updatedAt: "2021/08/05"
genre: "tech"
tags: ["TypeScript"]
---


# `Ｔ`を指定しないと`any`になる`axios.get`

いつも通り`axios.get()`を書いているときにふと思いました。「型引数の`T`を必須にすれば、この`any`を消せるのでは？」と。

```tsx
const asyncFunction = async () => {
  const response = await axios.get('/path/to/endpoint')
  const data = response.data // any 😢
  const foo = data.foo // 型エラーにはならないけど、fooはundefinedかもしれない
  // ...
}
```

`Ｔ`を指定し忘れたのか、意図的に指定しなかったのかは分かりませんが、`data`が`any`になってしまいました。これを防ぐためには「`Ｔ`を指定し忘れたらエラーになるようにする」のが手っ取り早そうです。

## 型引数を必須にする方法（横道）

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

# `<T = unknown>`という小技

さすがに↑みたいなやり方を`axios.get()`に求めるのはなんか違う気がします。というかそもそもの話、「型引数を必須にする」という考え方よりは、「正しい型引数が指定されるようにする」という考え方をすべきなのでしょう。

axios.getはAPIレスポンスの型なので、ユーザがどんな形にでも型を定義できるはずですから、「正しい型引数」とはなんやねん？という感じですが。 `<T = unknown>`が落としどころなんじゃないかと思います。 

```tsx
const asyncFunction = async () => {
  const response = await axios.get('/path/to/endpoint')
  const data = response.data // unknown
  // const foo= data.foo // type error
  if (hasFoo(data)) { // 型検査が必須になる😄 
    const foo = data.foo
    // ...
  }
}
```

# Issueを立てたよ

※あとで書きますが、すでにクローズ済み。

axiosの気持ちを想像してみたのですが、「なぜ`<T extends unknown>`にしないのか？」が分かりません。`unknown`型はプロパティアクセスをする前に型の検査が必要となるので、より型安全です。もし使われていない理由があるとしたら、`unknown`がTypeScript 3.0移行に導入されたものだから対応が漏れている（あるいはbreaking changesになるから入れられていない）くらいしかないかな、と予想しました。

疑念を持ちつつGitHubのissueを覗いてみたら、過去に同じことを考えている人がいたみたいです。ただし、残念ながらプロジェクトテンプレートに従っていないので、botによりcloseされていました。

[Use unknown type instead of any for Typescript definitions of response types #3313](https://github.com/axios/axios/issues/3313)

着眼点はいいのにこれはもったいないと思ったので、せこせこと文章とサンプルコードを用意し、issueを立てることにしました。

[Use unknown type instead of any for Typescript definitions of response types #3933](https://github.com/axios/axios/issues/3933)

これがどういった経過をたどるか分かりませんが、しばらく観察してみようと思います。
ここ何日か、日本のTwitterを中心に「[Project dead? #3930](https://github.com/axios/axios/issues/3930)」というissueが話題になったりもしているので、回答が来るかは分かりませんが。。。
botにcloseされたらそれはそれで残念ですが仕方ないな…って感じです。

（参考）

[TypeScript: Documentation - Generics - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)


## Issueについて追記①

ちゃんと調べたつもりだったんですが、out of dateになってるPRの中でちょうど「`unknown`がいいんじゃない？」っていうやりとりを見つけたので、Issueの方にも追記しておきました。

こちらはデフォルトの型引数を`never`にするという提案でしたが、当時はTypeScript 2系にaxiosが依存していたようで、`unknown`が使えなかったみたいです。

[Make the default type of response data never #3002](https://github.com/axios/axios/pull/3002)

これ見ると、`extends`じゃなくてデフォルト型引数でいいかもしれないですね…。=> 本文を修正しました。

## Issueについて追記②（このIssueはクローズしました。）

サンプルコードを少し修正しました。（型ガードが必要であることを明示）

それと、carloshida氏が[Improved type-safety for AxiosRequestConfig](https://github.com/axios/axios/pull/2995)というPRを作ってくれているとコメントをもらったので、issueはとじました。`AxiosRequestConfig`で指定できるようにする、という後方互換性も考えられためっちゃスマートな回答。めっちゃ勉強になりました。
