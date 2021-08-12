import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Markdown from 'react-markdown'
import { CodeBlock } from '../../components/CodeBlock'
import { getPost, getSlugs } from '../../utils/post'
import { generateOgpUrl } from '../../utils/ogp'

type StaticPaths = {
  slug: string
}

type StaticProps = {
  post: Post
  ogpUrl: string
}

const PostPage: NextPage<StaticProps> = (props) => {
  const { post, ogpUrl } = { ...props }
  const pageTitle =
    post.metadata.title + ' - お前もインターネットにしてやろうか'
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {!post.metadata.published && <meta name="robots" content="noindex" />}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:site_name" content={pageTitle} />
        <meta property="og:image" content={ogpUrl} />
        <meta name="twitter:card" content="Summary with Large Image" />
        <meta name="twitter:site" content="@asazutaiga" />
      </Head>
      <div className="text-6xl flex justify-center mt-10 mb-10">
        {post.metadata.emoji}
      </div>
      <h1 className="text-3xl font-bold mt-10 italic leading-tight">
        {post.metadata.title}
      </h1>
      <div className="underline-red mt-4 text-sm font-bold italic">
        {post.metadata.createdAt}
      </div>
      <div className="markdown mt-10 leading-relaxed">
        <Markdown
          components={{
            code({ inline, className, children }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <CodeBlock
                  language={match[1]}
                  value={children.toString().replace(/\n$/, '')}
                />
              ) : (
                <code className={className}>{children}</code>
              )
            },
          }}
        >
          {post.content}
        </Markdown>
      </div>
    </>
  )
}

// /md/配下のmarkdownファイル名を取得し、ファイル名をslugにする
export const getStaticPaths: GetStaticPaths<StaticPaths> = async () => {
  const slugs = await getSlugs()
  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug,
      },
    })),
    fallback: false,
  }
}

// markdownのメタデータ記法部分を変換してPropsにする
export const getStaticProps: GetStaticProps<StaticProps, StaticPaths> = async (
  context,
) => {
  const slug = context.params?.slug!
  const post = await getPost(slug)
  // devだとアクセスのたびに毎回走ってしまうので抑制する
  const ogpUrl =
    process.env.NODE_ENV === 'development'
      ? ''
      : generateOgpUrl(post.metadata.title)
  return {
    props: {
      post,
      ogpUrl,
    },
  }
}

export default PostPage
