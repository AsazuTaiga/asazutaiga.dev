import fs from 'fs'
import path from 'path'
import metadataParser from 'markdown-yaml-metadata-parser'

export const getSlugs = async () => {
  const dirPath = `${process.cwd()}/md`
  const fileNames = await fs.promises.readdir(dirPath)
  const slugs = fileNames.map((name) => path.parse(name).name)
  return slugs
}

export const getPost = async (slug: string) => {
  const filePath = `${process.cwd()}/md/${slug}.md`
  const rawPost = await fs.promises.readFile(filePath, 'utf-8')
  const post = metadataParser<Post>(rawPost)
  return post
}

export const getPostWithSlug = async (slug: string): Promise<PostWithSlug> => {
  const post = await getPost(slug)
  return { ...post, slug }
}
