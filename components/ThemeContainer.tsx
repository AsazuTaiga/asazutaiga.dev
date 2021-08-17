import { ReactNode } from 'react'
import { useTheme } from '../hooks/useTheme'

type Props = {
  children: ReactNode
}

export const ThemeContainer: React.VFC<Props> = ({ children }) => {
  const { theme } = useTheme()
  const bgColor = theme === 'light' ? 'bg-yellow-50' : 'bg-gray-900'
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-gray-100'
  return (
    <main className={`${theme} ${bgColor} ${textColor} h-screen`}>
      <div className={`${bgColor}`}>{children}</div>
    </main>
  )
}
