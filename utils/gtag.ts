export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export const sendPageViewEvent = (url: string): void => {
  if (process.env.NODE_ENV !== 'production') return
  if (!GA_TRACKING_ID) return
  if (!window.gtag) return

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export const sendSwitchThemeEvent = (toTheme: 'dark' | 'light') => {
  if (process.env.NODE_ENV !== 'production') return
  if (!GA_TRACKING_ID) return
  if (!window.gtag) return

  window.gtag('event', 'switch_theme', {
    to_theme: toTheme,
  })
}
