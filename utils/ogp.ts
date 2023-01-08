export const generateOgpUrl = (title: string, emoji: string) => {
  const encoded = encodeURI(title)
  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/og?title=${encoded}&emoji=${emoji}`
}
