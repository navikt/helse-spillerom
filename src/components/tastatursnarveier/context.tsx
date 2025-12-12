import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useRef } from 'react'

import {
    ModifierKey,
    ShortcutId,
    shortcutMetadata,
    ShortcutMetadata,
} from '@components/tastatursnarveier/shortcutMetadata'
import { useGlobalHandlers } from '@components/tastatursnarveier/useGlobalHandlers'

export type ShortcutHandler = () => void

type ShortcutContextType = {
    registerHandler: (id: ShortcutId, handler: ShortcutHandler) => void
    getHandler: (id: ShortcutId) => ShortcutHandler | null
}

const ShortcutContext = createContext<ShortcutContextType | null>(null)

export function ShortcutProvider({ children }: PropsWithChildren): ReactElement {
    const { allGlobalHandlers } = useGlobalHandlers()
    const handlersRef = useRef<Record<ShortcutId, ShortcutHandler>>({} as Record<ShortcutId, ShortcutHandler>)

    const registerHandler = (id: ShortcutId, handler: ShortcutHandler) => {
        handlersRef.current[id] = handler
    }

    const getHandler = (id: ShortcutId) => handlersRef.current[id] ?? null

    useKeydownEventListener(shortcutMetadata, getHandler)

    useEffect(() => {
        Object.entries(allGlobalHandlers).forEach(([id, handler]) => registerHandler(id as ShortcutId, handler))
    }, [allGlobalHandlers])

    return <ShortcutContext.Provider value={{ registerHandler, getHandler }}>{children}</ShortcutContext.Provider>
}

export function useShortcutContext(): ShortcutContextType {
    const context = useContext(ShortcutContext)
    if (!context) {
        throw new Error('useTastatursnarveierContext must be used within a TastatursnarveierProvider')
    }
    return context
}

function useKeydownEventListener(metadata: ShortcutMetadata[], getHandler: (id: ShortcutId) => ShortcutHandler | null) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!event.code) return // Valg i autocomplete-lister, f.eks. i søkefeltet, trigger et tynt keydown-event, som vi ikke trenger å håndtere her
            const activeModifiers: ModifierKey[] = []
            if (event.getModifierState('Alt')) activeModifiers.push('Alt')
            if (event.getModifierState('Shift')) activeModifiers.push('Shift')
            if (event.getModifierState('Meta')) activeModifiers.push('Meta')

            const matchedShortcut = metadata.find(
                (shortcut) =>
                    shortcut.key === event.code &&
                    (!shortcut.modifier || activeModifiers.includes(shortcut.modifier)) &&
                    (!shortcut.ignoreIfModifiers || activeModifiers.length === 0),
            )

            if (!matchedShortcut || shouldDisableShortcuts() || activeModifiers.includes('Meta')) {
                return
            }

            const handler = getHandler(matchedShortcut.id)
            handler?.()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [metadata, getHandler])
}

const isInputFocused = (): boolean =>
    document.activeElement instanceof HTMLTextAreaElement || document.activeElement instanceof HTMLInputElement

const isModalOpen = (): boolean => document.getElementById('modal') !== null

const shouldDisableShortcuts = (): boolean => isInputFocused() || isModalOpen()
