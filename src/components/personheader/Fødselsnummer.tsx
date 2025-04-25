import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement } from 'react'

interface FødselsnummerProps {
    fødselsnummer: string
}

export function Fødselsnummer({ fødselsnummer }: FødselsnummerProps): ReactElement {
    return (
        <HStack gap="1" align="center">
            <BodyShort>{fødselsnummer}</BodyShort>
            <Tooltip content="Kopier fødselsnummer">
                <CopyButton copyText={fødselsnummer} size="xsmall" />
            </Tooltip>
        </HStack>
    )
}
