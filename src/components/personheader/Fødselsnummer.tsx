import React, { ReactElement } from 'react'
import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'

const getFormattedFødselsnummer = (fødselsnummer: string) => {
    return fødselsnummer.slice(0, 6) + ' ' + fødselsnummer.slice(6)
}

interface FødselsnummerProps {
    fødselsnummer: string
}

export const Fødselsnummer = ({ fødselsnummer }: FødselsnummerProps): ReactElement => (
    <HStack gap="1">
        <BodyShort>{getFormattedFødselsnummer(fødselsnummer)}</BodyShort>
        <Tooltip content="Kopier fødselsnummer" keys={['alt', 'c']}>
            <CopyButton copyText={fødselsnummer} size="xsmall" />
        </Tooltip>
    </HStack>
)
