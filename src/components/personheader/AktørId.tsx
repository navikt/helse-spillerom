import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement } from 'react'

interface AktorIdProps {
    aktørId: string
}

export function AktørId({ aktørId }: AktorIdProps): ReactElement {
    return (
        <HStack gap="1" align="center">
            <BodyShort>Aktør-ID: {aktørId}</BodyShort>
            <Tooltip content="Kopier aktør-ID">
                <CopyButton copyText={aktørId} size="xsmall" />
            </Tooltip>
        </HStack>
    )
}
