import { useEffect, useState } from 'react'

/**
 * Custom hook for reading URL hash fragments
 * @returns hash - current hash value, undefined if no hash
 */
export function useHash(): string | undefined {
    const [hash, setHash] = useState<string | undefined>(undefined)

    useEffect(() => {
        // Les initial hash
        setHash(window.location.hash.slice(1) || undefined)

        // Lytt til hash-endringer
        const handleHashChange = () => {
            setHash(window.location.hash.slice(1) || undefined)
        }

        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    return hash
}
