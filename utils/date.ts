import dayjs from 'dayjs'

export const sortPostsByDate = <T extends Post>(posts: Array<T>) => {
  return posts.sort((a, b) =>
    dayjs(b.metadata.createdAt).isAfter(dayjs(a.metadata.createdAt)) ? -1 : 1,
  )
}
