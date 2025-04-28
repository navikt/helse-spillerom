import { PropsWithChildren, ReactElement } from 'react'
import { PageBlock } from '@navikt/ds-react/Page'

import { PersonHeader } from '@components/personheader/PersonHeader'
import { Tidslinje } from '@components/tidslinje/Tidslinje'

export default async function PersonLayout({ children }: PropsWithChildren): Promise<ReactElement> {
    return (
        <PageBlock as="main">
            <PersonHeader />
            <Tidslinje />
            {children}
        </PageBlock>
    )
}
