import 'tailwindcss/tailwind.css'
import '../css/global.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../hooks/useTheme'
import { ThemeSwitch } from '../components/ThemeSwitch'
import { Logo } from '../components/Logo'
import { Container } from '../components/Container'
import { MainWithBack } from '../components/MainWithBack'
import { Copy } from '../components/Copy'
import { Me } from '../components/Me'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ThemeSwitch />
      <MainWithBack>
        <Container>
          <Logo />
          <Component {...pageProps} />
          <div className="h-10" />
          <Me />
          <Copy />
        </Container>
      </MainWithBack>
    </ThemeProvider>
  )
}
export default MyApp
