import { createContext, PropsWithChildren, ReactElement, useContext, useSyncExternalStore } from 'react'

type AnonymizationContextType = { isAnonymized: boolean; toggle: () => void }

const AnonymizationContext = createContext<AnonymizationContextType | null>(null)

export function useAnonymizationContext(): AnonymizationContextType {
    const context = useContext(AnonymizationContext)
    if (!context) {
        throw new Error('useAnonymizationContext must be used within a AnonymizationProvider')
    }
    return context
}

export function AnonymizationProvider({ children }: PropsWithChildren): ReactElement {
    const isAnonymized = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    const toggle = () => {
        localStorage.setItem('anonymized', String(!isAnonymized))
        window.dispatchEvent(new Event('storage'))
    }

    return (
        <AnonymizationContext.Provider value={{ isAnonymized, toggle }}>
            <div className={isAnonymized ? 'anonymized' : ''}>{children}</div>
        </AnonymizationContext.Provider>
    )
}

function subscribe(callback: () => void) {
    window.addEventListener('storage', callback)
    return () => window.removeEventListener('storage', callback)
}

function getSnapshot(): boolean {
    return localStorage.getItem('anonymized') === 'true'
}

function getServerSnapshot(): boolean {
    return false
}
