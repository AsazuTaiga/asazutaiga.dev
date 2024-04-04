import Link from 'next/link'
import { Tag } from './Tag'
import { Twemoji } from './Twemoji'

type Props = {
  post: PostWithSlug
}

export const Card: React.VFC<Props> = ({ post }) => {
  const href = `/post/${post.slug}`
  return (
    <section className="cursor-pointer">
      <Link
        href={href}
        passHref
        className={`focus:ring-4 outline-none bg-white dark:bg-gray-700 hover:bg-purple-200 dark:hover:bg-gray-600 rounded-lg p-4 shadow-lg block transition-colors`}
      >
        <div className="flex items-center">
          <Twemoji
            emoji={post.metadata.emoji}
            size={60}
            className={`bg-purple-100 dark:bg-purple-300 p-2 rounded-md flex-shrink-0 shadow-inner`}
          />
          <div className="flex-col ml-3">
            <div className="text-lg font-bold">{post.metadata.title}</div>
            <div className="mt-2 text-sm">{post.metadata.createdAt}</div>
            <div className="mt-2 text-xs flex gap-2">
              {post.metadata.tags.map((tag, i) => (
                <Tag key={i}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}
