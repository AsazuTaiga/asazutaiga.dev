import 'tailwindcss/tailwind.css'
import '../css/global.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../hooks/useTheme'
import { ThemeSwitch } from '../components/ThemeSwitch'
import { Logo } from '../components/Logo'
import { LayoutContainer } from '../components/LayoutContainer'
import { ThemeContainer } from '../components/ThemeContainer'
import { Copy } from '../components/Copy'
import { Me } from '../components/Me'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ThemeSwitch />
      <ThemeContainer>
        <LayoutContainer>
          <Logo />
          <Component {...pageProps} />
          <div className="h-10" />
          <Me />
          <Copy />
        </LayoutContainer>
      </ThemeContainer>
    </ThemeProvider>
  )
}
export default MyApp
