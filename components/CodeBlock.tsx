import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  duotoneLight,
  duotoneDark,
} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import { useTheme } from '../hooks/useTheme'

type Props = {
  language?: string
  value: string
}

SyntaxHighlighter.registerLanguage('tsx', tsx)

export const CodeBlock: React.VFC<Props> = ({ language, value }) => {
  const { theme } = useTheme()
  const style = theme === 'light' ? duotoneLight : duotoneDark
  return (
    <SyntaxHighlighter language={language} style={style}>
      {value}
    </SyntaxHighlighter>
  )
}
