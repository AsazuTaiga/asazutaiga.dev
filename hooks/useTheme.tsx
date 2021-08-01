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
const LOCAL_STORAGE_KEY = 'theme'

const ThemeContext = createContext<ThemeContextValue>({ theme: 'light' })

type Props = {
  children: React.ReactNode
}

export const ThemeProvider: React.VFC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const storaged = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storaged === 'dark') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const setThemeWithLocalStorage = useCallback((theme: Theme) => {
    setTheme(theme)
    localStorage.setItem(LOCAL_STORAGE_KEY, theme)
  }, [])

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: setThemeWithLocalStorage }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
