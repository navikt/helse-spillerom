import React, { ReactElement } from 'react'
import { Tag } from '@navikt/ds-react'

import { ArbeidstakerInntektType } from '@schemas/inntektRequest'

export const TagFor: Record<ArbeidstakerInntektType, ReactElement> = {
    INNTEKTSMELDING: (
        <Tag variant="neutral" size="xsmall">
            IM
        </Tag>
    ),
    AINNTEKT: (
        <Tag variant="neutral" size="xsmall">
            AO
        </Tag>
    ),
    SKJONNSFASTSETTELSE: (
        <Tag variant="neutral" size="xsmall">
            skjønnsfastsatt
        </Tag>
    ),
    MANUELT_BEREGNET: (
        <Tag variant="neutral" size="xsmall">
            manuelt beregnet
        </Tag>
    ),
}
