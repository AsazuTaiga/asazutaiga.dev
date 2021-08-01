import 'tailwindcss/tailwind.css'
import '../css/global.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../hooks/useTheme'
import { ThemeSwitch } from '../components/ThemeSwitch'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ThemeSwitch />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
export default MyApp
