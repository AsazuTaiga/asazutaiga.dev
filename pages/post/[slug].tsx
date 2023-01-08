import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Script from 'next/script'
import Head from 'next/head'
import Router from 'next/router'
import Markdown from 'react-markdown'
import { CodeBlock } from '../../components/CodeBlock'
import { getPost, getSlugs } from '../../utils/post'
import { generateOgpUrl } from '../../utils/ogp'
import { Twemoji } from '../../components/Twemoji'
import { useTheme } from '../../hooks/useTheme'
import { useEffect, useState } from 'react'
import { EmbedTweet } from '../../components/EmbedTweet'
import NotFoundPage from '../404'

type StaticPaths = {
  slug: string
}

type StaticProps = {
  post: Post
  ogpUrl: string
}

const PostPage: NextPage<StaticProps> = (props) => {
  const { theme } = useTheme()
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
          className={`p-7 rounded-full ${
            theme === 'light' ? 'bg-purple-100' : 'bg-purple-300'
          }`}
        />
      </div>
      <h1 className="text-3xl font-bold mt-10 leading-tight">
        {post.metadata.title}
      </h1>
      <div className="mt-4 text-sm font-bold">{post.metadata.createdAt}</div>
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
