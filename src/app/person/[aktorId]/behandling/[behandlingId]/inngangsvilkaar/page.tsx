'use client'

import React, { ReactElement } from 'react'
import { Alert, Checkbox, CheckboxGroup } from '@navikt/ds-react'

import { NesteSteg } from '@components/nestesteg/NesteSteg'

export default function Page(): ReactElement {
    return (
        <>
            <Alert variant="info" className="my-8">
                Her avklarer man første inngangsvilkår som ikke krever at sykepengegrunnlaget er satt. Foreløpig bare et
                røft utkast. Hva hvis forlengelse?
            </Alert>

            <CheckboxGroup legend="Inngangsvilkår">
                <Checkbox value="1">Opptjening</Checkbox>
                <Checkbox value="2">Medlemskap</Checkbox>
            </CheckboxGroup>

            <NesteSteg nesteFane="sykepengegrunnlag" />
        </>
    )
}
