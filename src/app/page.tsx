import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'
import { PageBlock } from '@navikt/ds-react/Page'

export default async function Page(): Promise<ReactElement> {
    return (
        <PageBlock as="main" className="p-8">
            <Heading level="1" size="large">
                Hello world test
            </Heading>
        </PageBlock>
    )
}
