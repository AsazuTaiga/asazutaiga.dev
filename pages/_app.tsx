import 'tailwindcss/tailwind.css'
import '../css/global.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../hooks/useTheme'
import { LayoutContainer } from '../components/LayoutContainer'
import { ThemeContainer } from '../components/ThemeContainer'
import { Copy } from '../components/Copy'
import { Me } from '../components/Me'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { sendPageViewEvent } from '../utils/gtag'
import { AppBar } from '../components/AppBar'
import { AutoRefresh } from '../components/AutoRefresh'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const handleRouteChange = (url: string) => {
    sendPageViewEvent(url)
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <ThemeProvider>
      <ThemeContainer>
        <AppBar />
        <LayoutContainer>
          <AutoRefresh>
            <Component {...pageProps} />
            <div className="h-10" />
            <Me />
            <Copy />
          </AutoRefresh>
        </LayoutContainer>
      </ThemeContainer>
    </ThemeProvider>
  )
}
export default MyApp
