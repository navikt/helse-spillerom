import React from 'react'
import { BodyShort, HStack } from '@navikt/ds-react'
import { CheckmarkIcon } from '@navikt/aksel-icons'

interface AvkryssetProps {
    tekst: string
}

const Avkrysset = ({ tekst }: AvkryssetProps) => {
    return (
        <HStack gap="2" align="center">
            <CheckmarkIcon aria-hidden={true} className="h-4 min-h-4 w-4 min-w-4" title="Avkrysset" />
            <BodyShort size="small">{tekst}</BodyShort>
        </HStack>
    )
}

export default Avkrysset
