import { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { Dokumenter } from '@components/sidemenyer/høyremeny/Dokumenter'

export function Høyremeny(): ReactElement {
    return (
        <Sidemeny side="right">
            <Heading level="1" size="xsmall" className="mb-4 font-medium text-gray-500">
                Dokumenter
            </Heading>
            <Dokumenter />
        </Sidemeny>
    )
}
