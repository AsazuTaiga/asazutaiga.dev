type Post = {
  content: string
  metadata: {
    emoji: string
    title: string
    createdAt: string
    updatedAt: string
    genre: 'tech' | 'blog'
    tags: string[]
  }
}

type PostWithSlug = Post & {
  slug: string
}
