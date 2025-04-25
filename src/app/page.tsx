import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'
import { PageBlock } from '@navikt/ds-react/Page'

import { Personsøk } from '@components/personsøk/Personsøk'

export default async function Page(): Promise<ReactElement> {
    return (
        <PageBlock as="main" className="p-8">
            <Heading level="1" size="large">
                Hello world test
            </Heading>
            <Personsøk />
        </PageBlock>
    )
}
