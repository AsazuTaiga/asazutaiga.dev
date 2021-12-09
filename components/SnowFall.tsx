import { useEffect, useState } from 'react'
import SnowFall from 'react-snowfall'

export const NoSsrSnowFall: React.VFC = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [setMounted])
  if (!mounted) return null
  return <SnowFall />
}
