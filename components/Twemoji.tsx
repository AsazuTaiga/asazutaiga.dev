import twemoji from 'twemoji'

type Props = {
  emoji: string
  size: number
} & React.HTMLAttributes<HTMLDivElement>

export const Twemoji: React.VFC<Props> = ({ emoji, size, ...rest }) => {
  return (
    <div
      style={{
        width: size + 'px',
        height: size + 'px',
      }}
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(emoji, {
          folder: 'svg',
          ext: '.svg',
          // MaxCDNが廃止予定＆twemojiライブラリのメンテナがレイオフされたらしいので変更
          // https://zenn.dev/yhatt/articles/60ce0c3ca79994
          base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/',
        }),
      }}
      {...rest}
    ></div>
  )
}
