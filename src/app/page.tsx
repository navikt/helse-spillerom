import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'

export default async function Page(): Promise<ReactElement> {
    return (
        <div className="p-8">
            <Heading level="1" size="large">
                Hello world test
            </Heading>
        </div>
    )
}
