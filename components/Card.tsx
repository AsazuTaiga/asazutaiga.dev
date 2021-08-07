import Link from 'next/link'
import { useTheme } from '../hooks/useTheme'

type Props = {
  post: PostWithSlug
}

export const Card: React.VFC<Props> = ({ post }) => {
  const href = `/post/${post.slug}`
  const { theme } = useTheme()
  const bgColor = theme === 'light' ? 'bg-yellow-100' : 'bg-gray-700'
  const hoverColor =
    theme === 'light' ? 'hover:bg-yellow-200' : 'hover:bg-gray-600'
  return (
    <section className="cursor-pointer">
      <Link href={href} passHref>
        <a>
          <div className={`${bgColor} ${hoverColor} rounded-lg p-4`}>
            <div className="flex items-center">
              <div className="text-5xl">{post.metadata.emoji}</div>
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
