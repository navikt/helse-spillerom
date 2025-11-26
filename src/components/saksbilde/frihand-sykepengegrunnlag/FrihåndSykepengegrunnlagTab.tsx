import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'

import { FrihåndSykepengegrunnlagForm } from './FrihåndSykepengegrunnlagForm'
import { FrihåndSykepengegrunnlagVisning } from './FrihåndSykepengegrunnlagVisning'

export function FrihåndSykepengegrunnlagTab({ value }: { value: string }): ReactElement {
    const { data: sykepengegrunnlagResponse, isLoading } = useSykepengegrunnlag()
    const sykepengegrunnlag = sykepengegrunnlagResponse?.sykepengegrunnlag
    const harSykepengegrunnlag = sykepengegrunnlag != null
    const erFrihåndSykepengegrunnlag = sykepengegrunnlag?.type === 'FRIHÅND_SYKEPENGEGRUNNLAG'

    return (
        <SaksbildePanel value={value}>
            {isLoading ? (
                <div className="p-8">Laster...</div>
            ) : harSykepengegrunnlag && erFrihåndSykepengegrunnlag ? (
                <>
                    <Heading size="small" level="2" spacing>
                        Frihånd sykepengegrunnlag
                    </Heading>
                    <FrihåndSykepengegrunnlagVisning sykepengegrunnlag={sykepengegrunnlag} />
                </>
            ) : harSykepengegrunnlag ? (
                <div className="p-8">
                    <p>Sykepengegrunnlag er allerede opprettet, men det er ikke et frihånd sykepengegrunnlag.</p>
                </div>
            ) : (
                <FrihåndSykepengegrunnlagForm />
            )}
        </SaksbildePanel>
    )
}
