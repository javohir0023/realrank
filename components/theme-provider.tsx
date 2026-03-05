'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch and script injection issues
  // by only rendering the provider after mounting
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider
      {...props}
      enableColorScheme={false}
      nonce=""
    >
      {children}
    </NextThemesProvider>
  )
}
