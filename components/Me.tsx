import Image from 'next/image'
import linktree from '../public/linktree.svg'
import twitter from '../public/twitter.svg'
import github from '../public/github.svg'
import githubDark from '../public/github_dark.svg'
import { useTheme } from '../hooks/useTheme'

const TWITTER_MY_AVATAR_URL =
  'https://pbs.twimg.com/profile_images/1606963603336482817/S498lmc__400x400.jpg'
const LINKTREE_URL = 'https://linktr.ee/asazutaiga'
const TWITTER_URL = 'https://twitter.com/asazutaiga'
const GITHUB_URL = 'https://github.com/asazutaiga'
const RSS_URL = '/rss/feed.xml'

export const Me: React.VFC = () => {
  const { theme } = useTheme()
  return (
    <div className="flex justify-center">
      <div className="rounded-3xl w-20 h-20 overflow-hidden shadow-xl">
        <Image
          src={TWITTER_MY_AVATAR_URL}
          alt="Asazu Taiga"
          width={80}
          height={80}
        />
      </div>
      <div className="flex ml-4 flex-col h-20 justify-center">
        {/* eslint-disabled-next-line */}
        <div className="font-bold text-2xl">@AsazuTaiga</div>
        <div className="mt-2 flex flex-row gap-2">
          <CircleLink href={LINKTREE_URL} src={linktree} />
          <CircleLink href={TWITTER_URL} src={twitter} />
          <CircleLink
            href={GITHUB_URL}
            src={theme === 'light' ? github : githubDark}
          />
          <CircleLink href={RSS_URL} src="/rss.svg" />
        </div>
      </div>
    </div>
  )
}

const CircleLink: React.VFC<{ href: string; src: any }> = ({ href, src }) => (
  <a href={href} target="_blank" rel="noreferrer">
    <div className="w-8 h-8  rounded-full shadow-md flex justify-center items-center">
      <Image src={src} alt="" width={20} height={20} />
    </div>
  </a>
)
