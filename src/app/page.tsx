import React, { ReactElement } from 'react'
import { PageBlock } from '@navikt/ds-react/Page'
import { Heading } from '@navikt/ds-react'

import { Personsøk } from '@components/personsøk/Personsøk'

export default async function Page(): Promise<ReactElement> {
    return (
        <PageBlock as="main" className="mt-[14%] flex justify-center p-8">
            <Heading level="1" size="large" className="sr-only">
                Personsøk
            </Heading>
            <div className="w-md">
                <Personsøk />
            </div>
        </PageBlock>
    )
}
