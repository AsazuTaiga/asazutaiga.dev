import dayjs from 'dayjs'

export const sortAndFilterPosts = <T extends Post>(posts: Array<T>) => {
  return posts
    .sort((a, b) =>
      dayjs(a.metadata.createdAt).isAfter(dayjs(b.metadata.createdAt)) ? -1 : 1,
    )
    .filter((post) => post.metadata.published)
}
