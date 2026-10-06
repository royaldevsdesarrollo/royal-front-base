import { useEffect } from 'react'
import { useAppStore } from '@/shared/stores'

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const theme = useAppStore(state => state.theme)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY)

    const applyTheme = () => {
      const dark = theme === 'dark' || (theme === 'system' && mediaQuery.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    }

    applyTheme()
    mediaQuery.addEventListener('change', applyTheme)

    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [theme])

  return children
}
