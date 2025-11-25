import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { InntekterTilFordeling } from '@components/saksbilde/inntekter-til-fordeling/InntekterTilFordeling'

export function InntekterTilFordelingTab({ value }: { value: string }): ReactElement {
    return (
        <SaksbildePanel value={value}>
            <Heading size="small" level="2" spacing>
                Inntekter til fordeling
            </Heading>
            <InntekterTilFordeling />
        </SaksbildePanel>
    )
}
