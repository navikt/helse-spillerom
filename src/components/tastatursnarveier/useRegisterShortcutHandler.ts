import { useEffect } from 'react'

import { ShortcutHandler, useShortcutContext } from '@components/tastatursnarveier/context'
import { ShortcutId, shortcutMetadata } from '@components/tastatursnarveier/shortcutMetadata'

export function useRegisterShortcutHandler(id: ShortcutId, handler: ShortcutHandler) {
    const { registerHandler } = useShortcutContext()

    useEffect(() => {
        registerHandler(id, handler)
    }, [id, handler, registerHandler])

    return shortcutMetadata.find((s) => id === s.id)!
}
