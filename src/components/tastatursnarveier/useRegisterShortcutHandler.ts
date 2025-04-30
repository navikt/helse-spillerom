import { useEffect } from 'react'

import { ShortcutHandler, useTastatursnarveierContext } from '@components/tastatursnarveier/context'
import { ShortcutId } from '@components/tastatursnarveier/shortcutMetadata'

export function useRegisterShortcutHandler(id: ShortcutId, handler: ShortcutHandler) {
    const { registerHandler } = useTastatursnarveierContext()

    useEffect(() => {
        registerHandler(id, handler)
    }, [id, handler, registerHandler])
}
