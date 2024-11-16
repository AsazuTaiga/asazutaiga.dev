import { ReactNode, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'

type Props = {
  children: ReactNode
}

export const ThemeContainer: React.VFC<Props> = ({ children }) => {
  const { theme } = useTheme()

  useEffect(() => {
    const addClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
    const removeClass = theme === 'light' ? 'bg-gray-900' : 'bg-gray-50'
    const html = document.querySelector('html')
    html?.classList.add(addClass)
    html?.classList.remove(removeClass)
  }, [theme])

  return (
    <main className={`${theme}`}>
      <div className="text-gray-900 dark:text-gray-100 min-h-screen">
        {children}
      </div>
    </main>
  )
}
