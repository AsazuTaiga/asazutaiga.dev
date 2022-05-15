import Link from 'next/link'
import { useTheme } from '../hooks/useTheme'
import { Twemoji } from './Twemoji'

type Props = {
  post: PostWithSlug
}

export const Card: React.VFC<Props> = ({ post }) => {
  const href = `/post/${post.slug}`
  const { theme } = useTheme()
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-700'
  const emojiBgColor = theme === 'light' ? 'bg-purple-100' : 'bg-purple-300'
  const hoverColor =
    theme === 'light' ? 'hover:bg-purple-200' : 'hover:bg-gray-600'
  return (
    <section className="cursor-pointer">
      <Link href={href} passHref>
        <a>
          <div className={`${bgColor} ${hoverColor} rounded-lg p-4 shadow-lg`}>
            <div className="flex items-center">
              <Twemoji
                emoji={post.metadata.emoji}
                size={60}
                className={`${emojiBgColor} p-2 rounded-md flex-shrink-0`}
              />
              <div className="flex-col ml-3">
                <div className="text-md">{post.metadata.title}</div>
                <div className="mt-2 text-sm opacity-50">
                  {post.metadata.createdAt}
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </section>
  )
}
