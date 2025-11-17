import { ReactElement } from 'react'
import { BodyShort, HStack } from '@navikt/ds-react'

import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { formaterBeløpKroner } from '@schemas/øreUtils'

export function SykepengegrunnlagVisning(): ReactElement | null {
    const { data: sykepengegrunnlagResponse } = useSykepengegrunnlag()

    const sykepengegrunnlag = sykepengegrunnlagResponse?.sykepengegrunnlag

    // Vis ikke hvis det ikke er satt sykepengegrunnlag
    if (!sykepengegrunnlag) {
        return null
    }

    return (
        <HStack justify="space-between">
            <BodyShort size="small">Sykepengegrunnlag:</BodyShort>
            <BodyShort size="small">{formaterBeløpKroner(sykepengegrunnlag.sykepengegrunnlag)}</BodyShort>
        </HStack>
    )
}
