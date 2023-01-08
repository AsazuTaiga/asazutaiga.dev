import { Feed } from 'feed'
import fs from 'fs'
import { generateOgpUrl } from './ogp'

export const generateRss = (posts: PostWithSlug[]): void => {
  const baseUrl = 'https://asazutaiga.dev'
  const date = new Date()

  const author = {
    name: 'Asazu Taiga',
    email: 'taiga.asazu@icloud.com',
    link: 'https://twitter.com/asazutaiga',
  }

  const feed = new Feed({
    title: 'asazutaiga.dev',
    description: 'Asazu Taigaの技術ブログ',
    id: baseUrl,
    copyright: `© ${date.getFullYear()} ${author.name}`,
    link: baseUrl,
    language: 'ja',
    image: `${baseUrl}/favicon.svg`,
    updated: date,
    feedLinks: {
      rss2: `${baseUrl}/rss/feed.xml`,
      json: `${baseUrl}/rss/feed.json`,
      atom: `${baseUrl}/rss/atom.xml`,
    },
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.metadata.title,
      id: `${baseUrl}/post/${post.slug}`,
      link: `${baseUrl}/post/${post.slug}`,
      description:
        post.content.slice(0, 100).replace(/(\r\n|\n|\r)/gm, '') + '...',
      date: new Date(post.metadata.createdAt),
      image: generateOgpUrl(post.metadata.title, post.metadata.emoji),
    })
  })

  feed.addCategory('Technology')

  // pubcli/rssがなければ作成
  if (!fs.existsSync('./public/rss')) {
    fs.mkdirSync('./public/rss')
  }

  fs.writeFileSync('./public/rss/feed.xml', feed.rss2())
  fs.writeFileSync('./public/rss/feed.json', feed.json1())
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1())
}
