export const generateOgpUrl = (title: string, emoji: string) => {
  const encoded = encodeURI(title)
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'https://asazutaiga.dev'
  return `${baseUrl}/api/og?title=${encoded}&emoji=${emoji}`
}
