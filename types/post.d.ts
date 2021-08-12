type Post = {
  content: string
  metadata: {
    emoji: string
    title: string
    createdAt: string
    updatedAt: string
    published: boolean
    genre: 'tech' | 'blog'
    tags: string[]
  }
}

type PostWithSlug = Post & {
  slug: string
}
