'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
    children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="system"
            disableTransitionOnChange={false}
        >
            {children}
        </NextThemesProvider>
    )
}
