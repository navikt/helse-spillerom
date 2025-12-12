export function raise(error: Error | string): never {
    if (typeof error === 'string') {
        throw new Error(error)
    } else {
        throw error
    }
}

export function notNull<T>(value: T): value is NonNullable<T> {
    return value != null
}

export type Nullable<T> = {
    [P in keyof T]: T[P] | null
}

/**
 * Sjekker om vi kjører i Playwright test-miljø
 * Dette brukes for å deaktivere animasjoner i tester for å unngå flaky tests
 */
export function erPlaywrightTest(): boolean {
    return (
        typeof window !== 'undefined' &&
        (window.navigator?.userAgent?.includes('Playwright') ||
            process.env.NODE_ENV === 'test' ||
            process.env.PLAYWRIGHT_TEST === 'true')
    )
}

/**
 * Returnerer transition-objekt med riktig duration basert på miljø
 * I test-miljø settes duration til 0 for å unngå flaky tests
 */
export function getTestSafeTransition(defaultTransition: { duration: number; [key: string]: unknown }) {
    if (erPlaywrightTest()) {
        return { ...defaultTransition, duration: 0 }
    }
    return defaultTransition
}
