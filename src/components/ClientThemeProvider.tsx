'use client'

import { ThemeProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

export function ClientThemeProvider({ children, suppressHydrationWarning, ...props }: ThemeProviderProps & { suppressHydrationWarning?: boolean }) {
  return (
    <ThemeProvider {...props}>
      <div suppressHydrationWarning>{children}</div>
    </ThemeProvider>
  )
}
