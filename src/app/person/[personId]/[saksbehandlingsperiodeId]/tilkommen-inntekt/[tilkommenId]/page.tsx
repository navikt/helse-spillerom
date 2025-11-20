'use client'

import { ReactElement } from 'react'
import { Skeleton } from '@navikt/ds-react'

import { useTilkommenInntektByParamId } from '@hooks/queries/useTilkommenInntektByParamId'
import { TilkommenInntektView } from '@components/saksbilde/tilkommen-inntekt/TilkommenInntektView'

export default function TilkommenInntektPage(): ReactElement {
    const { tilkommenInntekt, isLoading } = useTilkommenInntektByParamId()

    if (isLoading || !tilkommenInntekt) {
        return (
            <section className="flex-auto p-8">
                <Skeleton variant="rectangle" height={400} />
            </section>
        )
    }

    return (
        <section className="flex-auto">
            <TilkommenInntektView tilkommenInntekt={tilkommenInntekt} />
        </section>
    )
}
