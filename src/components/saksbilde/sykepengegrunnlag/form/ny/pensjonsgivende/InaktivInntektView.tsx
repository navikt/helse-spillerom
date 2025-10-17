import React, { ReactElement } from 'react'
import { BodyShort } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/ny/defaultValues'
import { Maybe } from '@utils/tsUtils'
import { InntektData } from '@schemas/inntektData'
import { SykepengegrunnlagV2 } from '@schemas/sykepengegrunnlagV2'

type InaktivInntektViewProps = {
    inntektRequest?: InntektRequestFor<'INAKTIV'>
    inntektData?: Maybe<InntektData>
    sykepengegrunnlag?: Maybe<SykepengegrunnlagV2>
}

export function InaktivInntektView({
    inntektRequest,
    inntektData,
    sykepengegrunnlag,
}: InaktivInntektViewProps): ReactElement {
    const inntektRequestData = inntektRequest?.data
    if (!inntektRequestData) return <></>
    return (
        <>
            <BodyShort>Data fra inntektdata og inntektrequest</BodyShort>
            <pre className="text-sm">{JSON.stringify(inntektRequestData, null, 2)}</pre>
            {inntektData && <pre className="text-sm">{JSON.stringify(inntektData, null, 2)}</pre>}
            {sykepengegrunnlag?.næringsdel && (
                <pre className="text-sm">{JSON.stringify(sykepengegrunnlag.næringsdel, null, 2)}</pre>
            )}
        </>
    )
}
