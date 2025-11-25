import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { Refusjon } from '@components/saksbilde/refusjon/Refusjon'

export function RefusjonTab({ value }: { value: string }): ReactElement {
    return (
        <SaksbildePanel value={value}>
            <Heading size="small" level="2" spacing>
                Refusjon
            </Heading>
            <Refusjon />
        </SaksbildePanel>
    )
}
