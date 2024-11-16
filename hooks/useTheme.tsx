import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type Theme = 'light' | 'dark'
type ThemeContextValue = {
  theme: Theme
  setTheme?: (theme: Theme) => void
}
const ThemeContext = createContext<ThemeContextValue>({ theme: 'light' })
const getBrowserTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const getLocalTheme = () => localStorage.getItem('theme') as Theme | undefined

type Props = {
  children: React.ReactNode
}

export const ThemeProvider: React.VFC<Props> = ({ children }) => {
  const [theme, _setTheme] = useState<Theme>('light')

  const setTheme = useCallback(
    (theme: Theme) => {
      localStorage.setItem('theme', theme)
      _setTheme(theme)
    },
    [_setTheme],
  )

  useEffect(() => {
    setTheme(getLocalTheme() || getBrowserTheme())
  }, [setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
