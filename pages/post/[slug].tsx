import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Script from 'next/script'
import Head from 'next/head'
import Markdown from 'react-markdown'
import { CodeBlock } from '../../components/CodeBlock'
import { getPost, getSlugs } from '../../utils/post'
import { generateOgpUrl } from '../../utils/ogp'
import { Twemoji } from '../../components/Twemoji'
import { useEffect, useState } from 'react'
import { EmbedTweet } from '../../components/EmbedTweet'
import NotFoundPage from '../404'
import { Tag } from '../../components/Tag'
import { FiInfo } from 'react-icons/fi'

type StaticPaths = {
  slug: string
}

type StaticProps = {
  post: Post
  ogpUrl: string
}

const PostPage: NextPage<StaticProps> = (props) => {
  const { post, ogpUrl } = { ...props }
  const pageTitle = post.metadata.title + ' - asazutaiga.dev'
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // @ts-ignore
    if (window?.twttr) {
      setScriptLoaded(true)
    }
  }, [setScriptLoaded])

  if (!post.metadata.published) {
    return <NotFoundPage />
  }

  return (
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        onLoad={() => {
          setScriptLoaded(true)
        }}
      ></Script>
      <Head>
        <title>{pageTitle}</title>
        {!post.metadata.published && <meta name="robots" content="noindex" />}
        <link
          rel="icon"
          href="https://pbs.twimg.com/profile_images/1606963603336482817/S498lmc__400x400.jpg"
          type="image/jpeg"
        />
        <meta property="og:site_name" content={pageTitle} />
        <meta property="og:image" content={ogpUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@asazutaiga" />
        <meta name="twitter:creator" content="@asazutaiga" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:image" content={ogpUrl} />
      </Head>
      <div className="flex justify-center mt-10 mb-10">
        <Twemoji
          emoji={post.metadata.emoji}
          size={120}
          className={`p-7 rounded-full bg-purple-100 dark:bg-purple-300`}
        />
      </div>
      <h1 className="text-3xl font-bold mt-10 leading-tight">
        {post.metadata.title}
      </h1>
      <div className="mt-4 text-sm font-bold">{post.metadata.createdAt}</div>
      {post.metadata.tags.length > 0 && (
        <div className="mt-4 flex gap-2">
          {post.metadata.tags.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </div>
      )}
      <div
        className={`flex text-sm items-center gap-2 mt-10 p-2 border-l-4 shadow-md bg-purple-100 text-purple-800 border-purple-800 dark:bg-indigo-900 dark:text-indigo-100 dark:border-indigo-200`}
      >
        <FiInfo />
        この記事は{Math.ceil(post.content.length / 600)}分で読めます
      </div>

      <div className="markdown mt-10">
        <Markdown
          components={{
            code({ inline, className, children }) {
              const match = /language-(\w+)/.exec(className || '')

              // twitter
              if (match && match[1] === 'twitter') {
                return (
                  <EmbedTweet
                    id={children.toString().replace(/\n$/, '')}
                    scriptLoaded={scriptLoaded}
                  ></EmbedTweet>
                )
              }

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
      : generateOgpUrl(post.metadata.title, post.metadata.emoji)
  return {
    props: {
      post,
      ogpUrl,
    },
    notFound: !post.metadata.published,
  }
}

export default PostPage
