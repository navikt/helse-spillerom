import { PropsWithChildren, ReactElement } from 'react'
import { PageBlock } from '@navikt/ds-react/Page'
import { HStack } from '@navikt/ds-react'

import { PersonHeader } from '@components/personheader/PersonHeader'
import { Tidslinje } from '@components/tidslinje/Tidslinje'
import { Venstremeny } from '@components/sidemenyer/venstremeny/Venstremeny'
import { Høyremeny } from '@components/sidemenyer/høyremeny/Høyremeny'

export default async function PersonLayout({ children }: PropsWithChildren): Promise<ReactElement> {
    return (
        <PageBlock as="main">
            <PersonHeader />
            <Tidslinje />
            <HStack justify="space-between" className="min-h-[calc(100vh-18rem)]">
                <Venstremeny />
                {children}
                <Høyremeny />
            </HStack>
        </PageBlock>
    )
}
