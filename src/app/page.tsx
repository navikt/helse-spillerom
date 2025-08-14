import React, { ReactElement } from 'react'
import { PageBlock } from '@navikt/ds-react/Page'

import { Oppgaveliste } from '@components/oppgaveliste/Oppgaveliste'

export default async function Page(): Promise<ReactElement> {
    return (
        <PageBlock as="main" className="h-[calc(100vh-58px)]">
            <Oppgaveliste />
        </PageBlock>
    )
}
