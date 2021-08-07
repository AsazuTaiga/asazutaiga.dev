import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import { useTheme } from '../hooks/useTheme'

type Props = {
  language?: string
  value: string
}

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('json', json)

export const CodeBlock: React.VFC<Props> = ({ language, value }) => {
  const { theme } = useTheme()
  const style = theme === 'light' ? vs : vscDarkPlus
  return (
    <SyntaxHighlighter language={language} style={style}>
      {value}
    </SyntaxHighlighter>
  )
}
