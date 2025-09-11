import { PropsWithChildren, ReactElement } from 'react'
import { PageBlock } from '@navikt/ds-react/Page'

import { PersonHeader } from '@components/personheader/PersonHeader'
import { Tidslinje } from '@components/tidslinje/Tidslinje'
import { Venstremeny } from '@components/sidemenyer/venstremeny/Venstremeny'
import { Høyremeny } from '@components/sidemenyer/høyremeny/Høyremeny'

export default async function PersonLayout({ children }: PropsWithChildren): Promise<ReactElement> {
    return (
        <PageBlock as="main">
            <PersonHeader />
            <Tidslinje />
            <div className="flex min-h-[calc(100vh-18rem)] max-w-full overflow-hidden">
                <Venstremeny />
                <div className="min-w-0 flex-1 overflow-x-auto">{children}</div>
                <Høyremeny />
            </div>
        </PageBlock>
    )
}
