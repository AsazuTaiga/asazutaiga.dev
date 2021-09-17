import Link from 'next/link'
import { useTheme } from '../hooks/useTheme'
import { Twemoji } from './Twemoji'

type Props = {
  post: PostWithSlug
}

export const Card: React.VFC<Props> = ({ post }) => {
  const href = `/post/${post.slug}`
  const { theme } = useTheme()
  const bgColor = theme === 'light' ? 'bg-yellow-100' : 'bg-gray-700'
  const emojiBgColor = theme === 'light' ? 'bg-blue-100' : 'bg-yellow-300'
  const hoverColor =
    theme === 'light' ? 'hover:bg-yellow-200' : 'hover:bg-gray-600'
  return (
    <section className="cursor-pointer">
      <Link href={href} passHref>
        <a>
          <div className={`${bgColor} ${hoverColor} rounded-lg p-4`}>
            <div className="flex items-center">
              <Twemoji
                emoji={post.metadata.emoji}
                size={60}
                className={`${emojiBgColor} p-2 rounded-md flex-shrink-0`}
              />
              <div className="flex-col ml-3 font-bold italic">
                <div className="text-xl">{post.metadata.title}</div>
                <div className="mt-2 text-sm ">{post.metadata.createdAt}</div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </section>
  )
}
