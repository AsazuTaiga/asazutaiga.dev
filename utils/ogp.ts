export const generateOgpUrl = (title: string, emoji: string) => {
  const encoded = encodeURI(title)
  const baseUrl = 'asazutaiga.dev'
  return `https://${baseUrl}/api/og?title=${encoded}&emoji=${emoji}`
}
