import { ReactElement } from 'react'
import { Heading, VStack } from '@navikt/ds-react'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { Dokumenter } from '@components/sidemenyer/høyremeny/Dokumenter'
import { AaregKnapp } from '@components/sidemenyer/høyremeny/AaregKnapp'
import { AinntektKnapp } from '@components/sidemenyer/høyremeny/AinntektKnapp'

export function Høyremeny(): ReactElement {
    return (
        <Sidemeny side="right">
            <VStack gap="4">
                <Heading level="1" size="xsmall" className="font-medium text-gray-600">
                    Dokumenter
                </Heading>
                <Dokumenter />
                <AaregKnapp />
                <AinntektKnapp />
            </VStack>
        </Sidemeny>
    )
}
