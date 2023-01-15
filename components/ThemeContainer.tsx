import { ReactNode, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'

type Props = {
  children: ReactNode
}

export const ThemeContainer: React.VFC<Props> = ({ children }) => {
  const { theme } = useTheme()
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-gray-100'

  useEffect(() => {
    const addClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
    const removeClass = theme === 'light' ? 'bg-gray-900' : 'bg-gray-50'
    const html = document.querySelector('html')
    html?.classList.add(addClass)
    html?.classList.remove(removeClass)
  }, [theme])

  return (
    <main className={`${theme} ${textColor} min-h-screen`}>{children}</main>
  )
}
