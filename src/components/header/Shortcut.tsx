import React, { ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'

import { KeyCode, keyCodeLabel, ModifierKey, modifierLabels } from '../tastatursnarveier/shortcutMetadata'

interface ShortcutProps {
    keyCode: KeyCode
    modifier?: ModifierKey
}

export function Shortcut({ keyCode, modifier }: ShortcutProps): ReactElement {
    return (
        <HStack gap="05" className="text-ax-text-subtle text-medium justify-center" wrap={false}>
            {modifier && <span className="flex w-4 justify-center">{modifierLabels[modifier]}</span>}
            <span className="flex w-4 justify-center">{keyCodeLabel(keyCode)}</span>
        </HStack>
    )
}
