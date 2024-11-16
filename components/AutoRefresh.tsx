import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

export let AutoRefresh = ({ children }: Props) => {
  return <>{children}</>
}

if (process.env.NODE_ENV === 'development') {
  AutoRefresh = function AutoRefresh({ children }: Props) {
    const router = useRouter()
    useEffect(() => {
      const ws = new WebSocket('ws://localhost:3001')
      ws.onmessage = (event) => {
        if (event.data === 'refresh') {
          router.refresh()
        }
      }
      return () => {
        ws.close()
      }
    }, [router])
    return <>{children}</>
  }
}
