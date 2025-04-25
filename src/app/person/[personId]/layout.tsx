import { PropsWithChildren, ReactElement } from 'react'
import { PageBlock } from '@navikt/ds-react/Page'

import { PersonHeader } from '@components/personheader/PersonHeader'

export default async function PersonLayout({ children }: PropsWithChildren): Promise<ReactElement> {
    return (
        <PageBlock as="main">
            <PersonHeader />
            {children}
        </PageBlock>
    )
}
