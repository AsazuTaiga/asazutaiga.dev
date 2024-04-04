import Image from 'next/image'
import linktree from '../public/linktree.svg'
import x from '../public/x.svg'
import xDark from '../public/x_dark.svg'
import github from '../public/github.svg'
import githubDark from '../public/github_dark.svg'
import { useTheme } from '../hooks/useTheme'

const TWITTER_MY_AVATAR_URL =
  'https://pbs.twimg.com/profile_images/1606963603336482817/S498lmc__400x400.jpg'
const LINKTREE_URL = 'https://linktr.ee/asazutaiga'
const X_URL = 'https://x.com/asazutaiga'
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
          <CircleLink
            href={LINKTREE_URL}
            src={linktree}
            ariaLabel="Asazu TaigaのLinktree"
          />
          <CircleLink
            href={X_URL}
            src={theme === 'light' ? x : xDark}
            ariaLabel="Asazu TaigaのX"
          />
          <CircleLink
            href={GITHUB_URL}
            src={theme === 'light' ? github : githubDark}
            ariaLabel="Asazu TaigaのGitHub"
          />
          <CircleLink
            href={RSS_URL}
            src="/rss.svg"
            ariaLabel="RSSフィードを購読する"
          />
        </div>
      </div>
    </div>
  )
}

const CircleLink: React.VFC<{ href: string; src: any; ariaLabel: string }> = ({
  href,
  src,
  ariaLabel,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={ariaLabel}
    className="w-8 h-8  rounded-full shadow-md flex justify-center items-center focus:ring-4 outline-none "
  >
    <Image src={src} alt="" width={20} height={20} />
  </a>
)
