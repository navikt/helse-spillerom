import React from 'react'
import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'

interface AktørIdProps {
    aktørId: string
}

export const AktørId = ({ aktørId }: AktørIdProps) => (
    <HStack gap="1">
        <BodyShort>Aktør-ID: {aktørId}</BodyShort>
        <Tooltip content="Kopier aktør-ID">
            <CopyButton copyText={aktørId} size="xsmall" />
        </Tooltip>
    </HStack>
)
