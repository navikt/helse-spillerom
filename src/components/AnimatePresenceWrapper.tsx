'use client'

import { AnimatePresence, AnimatePresenceProps } from 'motion/react'

import { erPlaywrightTest } from '@utils/tsUtils'

interface AnimatePresenceWrapperProps extends Omit<AnimatePresenceProps, 'children'> {
    children: React.ReactNode
}

/**
 * Wrapper for AnimatePresence som deaktiverer animasjoner i Playwright test-miljø
 * for å unngå flaky tests
 */
export function AnimatePresenceWrapper({ children, ...props }: AnimatePresenceWrapperProps) {
    // Hvis vi kjører i test-miljø, returner bare children uten animasjon
    if (erPlaywrightTest()) {
        return <>{children}</>
    }

    // Ellers bruk normal AnimatePresence
    return <AnimatePresence {...props}>{children}</AnimatePresence>
}
