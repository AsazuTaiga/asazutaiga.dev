import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type ThemeContextValue = {
  theme: Theme
  setTheme?: (theme: Theme) => void
}
const ThemeContext = createContext<ThemeContextValue>({ theme: 'light' })
const getBrowserTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

type Props = {
  children: React.ReactNode
}

export const ThemeProvider: React.VFC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    setTheme(getBrowserTheme())
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
