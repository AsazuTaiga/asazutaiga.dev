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
        __html: twemoji.parse(emoji, { folder: 'svg', ext: '.svg' }),
      }}
      {...rest}
    ></div>
  )
}
