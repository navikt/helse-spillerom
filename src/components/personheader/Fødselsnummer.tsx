import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement, useRef } from 'react'

import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'

interface FødselsnummerProps {
    fødselsnummer: string
}

export function Fødselsnummer({ fødselsnummer }: FødselsnummerProps): ReactElement {
    const ref = useRef<HTMLButtonElement>(null)

    useRegisterShortcutHandler('copy_fødselsnummer', () => ref.current?.click())

    return (
        <HStack gap="1" align="center">
            <BodyShort>{fødselsnummer}</BodyShort>
            <Tooltip content="Kopier fødselsnummer" keys={['alt', 'c']}>
                <CopyButton copyText={fødselsnummer} size="xsmall" ref={ref} />
            </Tooltip>
        </HStack>
    )
}
