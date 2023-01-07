import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

export const EmbedTweet = ({
  id,
  scriptLoaded,
}: {
  id: string
  scriptLoaded: boolean
}) => {
  const containerRef = useRef(null) // コンポーネントのルートとなる要素を取得
  const { theme } = useTheme()
  const [tweetLoaded, setTweetLoaded] = useState(false)

  useEffect(() => {
    // @ts-ignore
    if (scriptLoaded && window.twttr?.widgets) {
      // @ts-ignore
      window.twttr.widgets
        .createTweet(id, containerRef.current, {
          theme,
          align: 'center',
          lang: 'ja',
        })
        .then(() => {
          setTweetLoaded(true)
        })
    }
  }, [id, theme, scriptLoaded, setTweetLoaded])

  const themeColor = theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'

  return (
    <div ref={containerRef}>
      {(!scriptLoaded || !tweetLoaded) && (
        <div className="flex justify-center">
          <div
            className={
              themeColor +
              ' bg-gray-200 animate-pulse rounded-lg h-64 max-w-lg w-full'
            }
          ></div>
        </div>
      )}
    </div>
  )
}
