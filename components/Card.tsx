import Link from 'next/link'

type Props = {
  post: PostWithSlug
}

export const Card: React.VFC<Props> = ({ post }) => {
  const href = `/post/${post.slug}`
  return (
    <section className="mt-20 mb-20 cursor-pointer">
      <Link href={href}>
        <div className="bg-yellow-100 hover:bg-yellow-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="text-5xl">{post.metadata.emoji}</div>
            <div className="flex-col ml-3 font-bold italic">
              <div className="text-xl">{post.metadata.title}</div>
              <div className="mt-2 text-sm ">{post.metadata.createdAt}</div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}
