import { useSyncExternalStore } from 'react'

/**
 * Custom hook for reading URL hash fragments
 * @returns hash - current hash value, undefined if no hash
 */
export function useHash(): string | undefined {
    return useSyncExternalStore(subscribe, getHash, () => undefined)
}

function getHash(): string | undefined {
    if (typeof window === 'undefined') return undefined
    return window.location.hash.slice(1) || undefined
}

function subscribe(callback: () => void): () => void {
    window.addEventListener('hashchange', callback)
    return () => window.removeEventListener('hashchange', callback)
}
