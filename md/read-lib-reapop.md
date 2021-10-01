---
emoji: '✅'
title: 'Reapopの実装を読む'
createdAt: '2021/08/12'
updatedAt: '2021/08/12'
published: false
genre: 'tech'
tags: ['React', 'library', 'code reading']
---

# Reapop とは？

シンプルで使いやすい API を備えた、おしゃれな通知（snackbar）を表示する React 向けライブラリです。

- [GitHub](https://github.com/LouisBarranqueiro/reapop)

- [Demo](https://louisbarranqueiro.github.io/reapop/)

デモサイトでは、機能やテーマなどをカスタムして試すことができます。

![Reapop](https://i.gyazo.com/268d9ef47ea173a3444d01e03c1dadfc.png)

※使い方等は公式を見てください。この記事では、自分の勉強のために Reapop のコードリーディングをしていきますので、間違った内容があったらごめんなさい。

様々なアニメーションを組み合わせ、またスナックバー特有のキュー管理をしているこのライブラリを読めば、そのあたりに強くなれるかな、みたいな目的意識をもって読んでいきます。

# コードリーディング

## まずは`README.md`で使い方を整理しよう

- [README.md](https://github.com/LouisBarranqueiro/reapop)

## とりあえず`index.ts`を眺める

ざっくりどういう登場人物がいるかがわかります。

```tsx
import NotificationsSystem from './components/NotificationsSystem'
import { NotificationsProvider } from './components/NotificationsProvider'
import { STATUSES, POSITIONS } from './constants'
import {
  notify,
  dismissNotifications,
  dismissNotification,
} from './reducers/notifications/actions'
import FadeTransition from './components/FadeTransition'
import SlideTransition from './components/SlideTransition'
import GrowTransition from './components/GrowTransition'
import reducer from './reducers/notifications/reducer'
import { useNotifications } from './hooks/useNotifications'
import baseTheme from './themes/base'
import atalhoTheme from './themes/atalho'
import wyboTheme from './themes/wybo'
import bootstrapTheme from './themes/bootstrap'

import { Theme } from './themes/types'
import { setUpNotifications } from './services/notifications'

export {
  // themes
  baseTheme,
  atalhoTheme,
  wyboTheme,
  bootstrapTheme,
  // utils
  setUpNotifications,
  useNotifications,
  // constants
  STATUSES,
  POSITIONS,
  //reducers
  reducer,
  // actions
  notify,
  dismissNotifications,
  dismissNotification,
  // components
  FadeTransition,
  SlideTransition,
  GrowTransition,
  NotificationsProvider,
}

// types
export * from './reducers/notifications/types'
export type { Theme }

export default NotificationsSystem
```

`export default`されているのは、`NotificationSystem`なので、これが Reapop のコアと言ってよさそう。また、`export`文の中できれいにモジュールの役割が書かれているので、わかりやすいですね。

（また、README を読む限り、`reducer`については redux との統合を前提とした API のようです。）

まずは`NotificationSystem`を軸に読み進めていきます。

## `NotificationSystem`

基本的には、`ComponentsContext.Prvider`を返却するコンポーネントとなっています。使い方としては、

```ts
const
```
