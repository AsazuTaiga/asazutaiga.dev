import Image from 'next/image'
import me from '../public/me.jpg'
import twitter from '../public/twitter.svg'
import twitterDark from '../public/twitter_dark.svg'
import github from '../public/github.svg'
import githubDark from '../public/github_dark.svg'
import { useTheme } from '../hooks/useTheme'

export const Me: React.VFC = () => {
  const { theme } = useTheme()
  return (
    <div className="flex justify-center">
      <div className="border-2 border-black rounded-3xl w-20 h-20 overflow-hidden">
        <Image src={me} alt="Asazu Taiga" />
      </div>
      <div className="flex ml-4 flex-col">
        <div className="font-bold italic text-2xl">@asazutaiga</div>
        <div className="text-xs mt-2">毎日お風呂に入るのでえらい</div>
        <div className="mt-2 flex flex-row">
          <div className="cursor-pointer">
            <a
              href="https://twitter.com/asazutaiga"
              aria-label="twitterへのリンク"
            >
              <Image
                src={theme === 'light' ? twitter : twitterDark}
                alt="twitter"
              />
            </a>
          </div>
          <div className="ml-2 cursor-pointer">
            <a
              href="https://github.com/asazutaiga"
              aria-label="githubへのリンク"
            >
              <Image
                src={theme === 'light' ? github : githubDark}
                alt="github"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
