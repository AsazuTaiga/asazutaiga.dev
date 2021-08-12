import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { Card } from '../components/Card'
import { sortPostsByDate } from '../utils/date'
import { getPostWithSlug, getSlugs } from '../utils/post'

type StaticProps = {
  posts: PostWithSlug[]
}

const HomePage: NextPage<StaticProps> = (proprs) => {
  return (
    <>
      <Head>
        <title>お前もインターネットにしてやろうか</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="h-10" />
      {proprs.posts.map(
        (post) =>
          post.metadata.published && (
            <React.Fragment key={post.slug}>
              <div className="h-3" />
              <Card post={post} />
              <div className="h-3" />
            </React.Fragment>
          ),
      )}
    </>
  )
}

export default HomePage

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const slugs = await getSlugs()
  const posts = await Promise.all(slugs.map((slug) => getPostWithSlug(slug)))
  const sortedPosts = sortPostsByDate(posts)
  return {
    props: {
      posts: sortedPosts,
    },
  }
}
