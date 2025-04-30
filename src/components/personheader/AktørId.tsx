import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement, useRef } from 'react'

import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'

interface AktorIdProps {
    aktørId: string
}

export function AktørId({ aktørId }: AktorIdProps): ReactElement {
    const ref = useRef<HTMLButtonElement>(null)

    useRegisterShortcutHandler('copy_aktør_id', () => ref.current?.click())

    return (
        <HStack gap="1" align="center">
            <BodyShort>Aktør-ID: {aktørId}</BodyShort>
            <Tooltip content="Kopier aktør-ID" keys={['alt', 'a']}>
                <CopyButton copyText={aktørId} size="xsmall" ref={ref} />
            </Tooltip>
        </HStack>
    )
}
