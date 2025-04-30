import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement, useRef } from 'react'

import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'
import { keyCodeLabel, modifierLabels } from '@components/tastatursnarveier/shortcutMetadata'

interface AktorIdProps {
    aktørId: string
}

export function AktørId({ aktørId }: AktorIdProps): ReactElement {
    const ref = useRef<HTMLButtonElement>(null)
    const shortcut = useRegisterShortcutHandler('copy_aktør_id', () => ref.current?.click())
    const keyLabel = keyCodeLabel(shortcut.key)
    const keys = shortcut.modifier ? [modifierLabels[shortcut.modifier], keyLabel] : [keyLabel]

    return (
        <HStack gap="1" align="center">
            <BodyShort>Aktør-ID: {aktørId}</BodyShort>
            <Tooltip content="Kopier aktør-ID" keys={keys}>
                <CopyButton copyText={aktørId} size="xsmall" ref={ref} />
            </Tooltip>
        </HStack>
    )
}
