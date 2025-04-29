import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement } from 'react'

interface NavnOgAlderProps {
    navn: string
    alder: number
}

export function NavnOgAlder({ navn, alder }: NavnOgAlderProps): ReactElement {
    return (
        <HStack gap="1" align="center">
            <BodyShort weight="semibold">
                {navn} ({alder} år)
            </BodyShort>
            <Tooltip content="Kopier navn">
                <CopyButton copyText={navn} size="xsmall" />
            </Tooltip>
        </HStack>
    )
}
