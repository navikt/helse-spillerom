import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement, useRef } from 'react'

import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'
import { keyCodeLabel, modifierLabels } from '@components/tastatursnarveier/shortcutMetadata'

interface FødselsnummerProps {
    fødselsnummer: string
}

export function Fødselsnummer({ fødselsnummer }: FødselsnummerProps): ReactElement {
    const ref = useRef<HTMLButtonElement>(null)
    const shortcut = useRegisterShortcutHandler('copy_fødselsnummer', () => ref.current?.click())
    const keyLabel = keyCodeLabel(shortcut.key)
    const keys = shortcut.modifier ? [modifierLabels[shortcut.modifier], keyLabel] : [keyLabel]

    return (
        <HStack gap="1" align="center">
            <BodyShort>{fødselsnummer}</BodyShort>
            <Tooltip content="Kopier fødselsnummer" keys={keys}>
                <CopyButton copyText={fødselsnummer} size="xsmall" ref={ref} />
            </Tooltip>
        </HStack>
    )
}
